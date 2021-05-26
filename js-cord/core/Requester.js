const fetch = require('node-fetch');
const Queue = require('./Queue');
const utils = require('../utils');
const { HTTPError } = require('../errors/Errors');

let badRequests = 0;
let resetCounterAt = null;
const REQUEST_OFFSET = 500;
const RETRY_LIMIT = 1;

// Rate-limit handling inspired by discord.py.
// Most of this logic comes from how discord.js handles ratelimits.
module.exports = class Requester {
    constructor(http) {
        this.http = http;
        this._queue = new Queue();
        this._reset = -1;
        this._remaining = -1;
        this._limit = -1;
        this.retries = new Map();
    }

    async request(route, payload, contentType = 'application/json') {
        await this._queue.wait();
        try {
            return await this.__request(route, payload, contentType);
        } finally {
            this._queue.shift();
        }
    }

    get globallyLimitted() {
        return this.http.ratelimit.remaining <= 0 
            && Date.now() < this.http.ratelimit.reset;
    }

    get locallyLimited() {
        return this._remaining <= 0 
            && Date.now() < this._reset;
    }

    get ratelimited() {
        return this.globallyLimitted || this.locallyLimited;
    }

    get running() {
        return this._queue.count > 0 || this.ratelimited;
    }
 
    _delay(delay) {
        return new Promise(r => {
            setTimeout(() => {
                this.http.ratelimit.delay = null;
                r();
            }, delay);
        })
    }

    _incrRetries(key) {
        let buffer = this.retries.get(key);
        this.retries.set(key, buffer + 1);
    }

    async __request(route, payload, contentType) {
        const headers = {
            'Content-Type': contentType,
            'User-Agent': this.http.userAgent,
            'Authorization': `Bot ${this.http.token}`
        };

        const method = route.method.toLowerCase();

        let body;
        if (payload) {
            payload['Content-Type'] = contentType
            body = JSON.stringify(payload);
        }

        if (!this.retries.has([route, payload]))
            this.retries.set([route, payload], 0);
        const options = { method: method, headers: headers, body: body };

        while (this.ratelimited) {
            const isGlobalLimit = this.globallyLimitted;
            let limit, timeout, delay;

            if (isGlobalLimit) {
                limit = this.http.ratelimit.limit;
                timeout = this.http.ratelimit.reset + REQUEST_OFFSET - Date.now();

                if (!this.http.ratelimit.delay)
                    this.http.ratelimit.delay = this._delay(timeout);
                delay = this.http.ratelimit.delay;
            } else {
                limit = this._limit;
                timeout = this._reset + REQUEST_OFFSET - Date.now();
                delay = utils.sleep(timeout);
            }

            await delay;
        }

        if (!this.http.ratelimit.reset || this.http.ratelimit.reset < Date.now()) {
            this.http.ratelimit.reset = Date.now() + 1000;
            this.http.ratelimit.remaining = this.http.ratelimit.limit;
            
        }
        this.http.ratelimit.remaining--;

        let response;
        try {
            response = await fetch(route.url, options);
        } catch (exc) {
            if (this.retries.get([route, payload]) >= RETRY_LIMIT) {
                throw new HTTPError(`${error.status}: ${exc.message}`);
            }

            this._incrRetries([route, payload]);
            return this.__request(route, payload, contentType);
        }

        let _timeout;
        if (response?.headers) {
            const h = response.headers;
            const date = h.get('date');
            const limit = h.get('x-ratelimit-limit');
            const remaining = h.get('x-ratelimit-remaining');
            const reset = h.get('x-ratelimit-reset');
            const resetAfter = h.get('x-ratelimit-reset-after');

            this._limit = limit ? Number(limit) : Infinity;
            this._remaining = remaining ? Number(remaining) : 1;
            this._reset = reset || resetAfter
                ? (
                    resetAfter 
                    ? Date.now() + Number(resetAfter) * 1000
                    : new Date(Number(reset) * 1000).getTime()
                        - (new Date(date).getTime() - Date.now())
                ) : Date.now();
            
            if (!resetAfter && route.url.includes('reactions'))
                this._reset = new Date(date).getTime() - (
                    new Date(date).getTime() - Date.now()
                );
            
            let retryAfter = h.get('retry-after');
            retryAfter = retryAfter ? Number(retryAfter) * 1000 : -1;
            if (retryAfter > 0) {
                if (h.get('x-ratelimit-global')) {
                    this.http.ratelimit.remaining = 0;
                    this.http.ratelimit.reset = Date.now() + retryAfter;
                } else if (!this.locallyLimited) {
                    _timeout = retryAfter;
                }
            }
        }

        if ([401, 403, 429].includes(response.status)) {
            if (!resetCounterAt || resetCounterAt < Date.now()) {
                resetCounterAt = Date.now() + 1000 * 600;  // 10 minutes
                badRequests = 0;
            }
            badRequests++;
        }

        if (response.ok) 
            return response;

        if (400 <= response.status < 500) {
            if (response.status === 429) {
                if (_timeout) {
                    await utils.sleep(_timeout);
                }
                return this.__request(route, payload, contentType);
            }

            throw new HTTPError(`Tried to ${route.method} from ${route.url}, received ${response.status}`)
        }

        if (500 <= response.status < 600) {
            if (this.retries.get([route, payload]) >= RETRY_LIMIT) {
                throw new HTTPError(response.statusText);
            }
            this._incrRetries([route, payload]);
            return this.__request(route, payload, contentType);
        }

        return null;
    }
}
