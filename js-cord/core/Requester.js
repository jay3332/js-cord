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
        return this.baseURL + '/' + this.route; 
    }
}


module.exports = class Requester {
    #apiVersion;

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

    async createMessage(destinationID, payload) {
        const route = `/channels/${destinationID}/messages`;
        return await this.request(this.route('POST', route), payload);
    }

    async editMessage(destinationID, messageID, payload) {
        const route = `/channels/${destinationID}/messages/${messageID}`;
        return await this.request(this.route('PATCH', route), payload);
    }

    async getGuild(guildID) {
        return await this.request(this.route('GET', `/guilds/${guildID}`));
    }

    async editGuild(guildID, payload) {
        return await this.request(this.route('PATCH', `/guilds/${guildID}`), payload);
    }

    async deleteGuild(guildID) {
        return await this.request(this.route('DELETE', `/guilds/${guildID}`));
    }

    async getGuildChannels(guildID) {
        return await this.request(this.route('GET', `/guilds/${guildID}/channels`));
    }

    async createGuildChannel(guildID, payload) {
        return await this.request(this.route('POST', `/guilds/${guildID}/channels`, payload));
    }

    async editGuildChannelPositions(guildID, payload) {
        return await this.request(this.route('PATCH', `/guilds/${guildID}/channels`), payload);
    }

    async getMember(guildID, userID) {
        return await this.request(this.route('GET', `/guilds/${guildID}/members/${userID}`));
    }

    async getMembers(guildID, /*limit, after*/) {
        const route = `/guilds/${guildID}/members`;
        return await this.request(this.route('GET', route));
    }

    async createGuild(name) {
        return await this.request(this.route('POST', '/guilds'), {name: name});
    }
}
