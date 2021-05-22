const fetch = require('node-fetch');
const { HTTP_URL } = require('../constants');

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
        this._apiVersion = v;
        this._token = undefined;
    } 

    get userAgent() {
        return 'DiscordBot (js-cord 1.0)';
    }

    get token() {
        if (!this._token) throw new ReferenceError('Token is undefined.');
        return this._token;
    }

    route(...args) {
        return new Route(this._apiVersion, ...args);
    }

    async request(route, payload, contentType = 'application/json') {
        let method = route.method.toLowerCase();
        let headers = {
            'Content-Type': contentType,
            'User-Agent': this.userAgent,
            'X-Ratelimit-Precision': 'millisecond',
            'Authorization': this.botToken ? `Bot ${this.token}` : this.token
        }
        if (reqbody) reqbody['Content-Type'] = contentType;

        let body = JSON.stringify(reqbody || {});
        let result = await http(route.url, { method: method, headers: headers, body: !!reqbody ? body : undefined });
        let res = result.json();

        if (res.retry_after) {
            await new Promise(r => setTimeout(r, res.retry_after*1000));
            result = await http(route.url, { method: method, headers: headers, body: !!reqbody ? body : undefined });
            res = result.json();
        }
        if (this.client.debug) console.log(res);
        return res;
    }
}
