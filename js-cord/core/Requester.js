const fetch = require('node-fetch');
const { HTTP_URL } = require('../constants');
const { sleep } = require('../utils');
const { InvalidToken } = require('../errors/Errors');

class Route {
    constructor(v, method='GET', route='/') {
        if (route.startsWith('/')) route = route.slice(1,);
        this.baseURL = `${HTTP_URL}/v${v}`; 
        this.method = method;
        this.route = route;
    }

    get url() {
        return this.baseURL + route; 
    }
}


module.exports = class Requester {
    constructor(client, v=9) {
        this.client = client;
        this.#apiVersion = v;
    } 

    get userAgent() {
        return 'DiscordBot (js-cord 1.0)';
    }

    get token() {
        if (!this.client.token) 
            throw new InvalidToken('Token is undefined.');
        return this.client.token
    }

    route(...args) {
        return new Route(this.#apiVersion, ...args);
    }

    async request(route, payload, contentType = 'application/json') {
        let method = route.method.toLowerCase();
        let headers = {
            'Content-Type': contentType,
            'User-Agent': this.userAgent,
            'X-Ratelimit-Precision': 'millisecond',
            'Authorization': `Bot ${this.token}`
        }

        let body;

        if (payload) {
            payload['Content-Type'] = contentType
            body = JSON.stringify(payload);
        }

        let options = { method: method, headers: headers, body: body };
        let result = await fetch(route.url, options);
        let data = result.json();

        if (data.retry_after) {
            await sleep(data.retry_after * 1000);
            result = await fetch(route.url, options);
            data = result.json();
        }

        if (this.client.debug) 
            console.log(data);
        return data;
    }

    async getRecommendedShardCount() {
        const route = this.route('GET', '/gateway/bot');
        let result = await this.request(route);
        return result.shards
    }

    async getClientInformation() {
        return await this.request(this.route('GET', '/users/@me'));
    }

    async logout() {
        return await this.request(this.route('POST', '/auth/logout'));
    }
}
