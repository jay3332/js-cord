const fetch = require('node-fetch');
const { HTTP_URL } = require('../constants');
const { sleep } = require('../utils');
const { InvalidToken } = require('../errors/Errors');
const Requester = require('./Requester');

class Route {
    constructor(v, method='GET', route='/') {
        if (route.startsWith('/')) route = route.slice(1);
        this.baseURL = `${HTTP_URL}/v${v}`; 
        this.method = method;
        this.route = route;
    }

    get url() {
        return this.baseURL + '/' + this.route; 
    }
}


module.exports = class HTTPClient {
    #apiVersion;

    constructor(client, v=9) {
        this.client = client;
        this.#apiVersion = v;
        this.requesters = new Map();
        this.ratelimit = {
            limit: Infinity,
            remaining: Infinity,
            reset: null,
            delay: null, 
        }
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
        let requester = this.requesters.get(route.url);
        if (!requester) {
            requester = new Requester(this);
            this.requesters.set(route.url, requester);
        }

        const res = await requester.request(route, payload, contentType);
        try {
            return await res.json();
        } catch (exc) {
            return null;
        }
    }

    async _oldRequest(route, payload, contentType = 'application/json') {
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
    
    async getConnectionInfo() {
        const route = this.route('GET', '/gateway/bot');
        return await this.request(route);
    }

    async getRecommendedShardCount() {
        return (await this.getConnectionInfo()).shards;
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

    async deleteMessage(destinationID, messageID) {
        const route = `/channels/${destinationID}/messages/${messageID}`;
        return await this.request(this.route('DELETE', route));
    }

    _encodeEmoji(data) {
        if (!data.id) {
            return encodeURI(data.name); 
        }
        return encodeURI(data.name + ':' + data.id);
    }

    async addReaction(destinationID, messageID, emoji) {
        const route = `/channels/${destinationID}/messages/${messageID}/reactions/${this._encodeEmoji(emoji)}/@me`;
        return await this.request(this.route('PUT', route));
    }

    async getReactionUsers(destinationID, messageID, emoji, { limit, after } = {}) {
        let params = {}
        if (limit) params.limit = limit;
        if (after) params.after = after;
        params = Object.keys(params).length
            ? '?' + new URLSearchParams(params).toString() : '';

        const route = `/channels/${destinationID}/messages/${messageID}/reactions/${this._encodeEmoji(emoji)}`;
        return await this.request(this.route('GET', route + params));
    }

    async getGuild(guildID) {
        return await this.request(this.route('GET', `/guilds/${guildID}`));
    }

    async createGuild(name) {
        return await this.request(this.route('POST', '/guilds'), { name: name });
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

    async respondToInteraction(id, token, type, payload) {
        const route = `/interactions/${id}/${token}/callback`;
        payload = { type: type, data: payload };
        return await this.request(this.route('POST', route), payload);
    }

    async createGlobalSlashCommand(payload) {
        return await this.request(
            this.route('POST', `/applications/${this.client.id}/commands`), payload
        );
    }

    async createGuildSlashCommand(guildID, payload) {
        return await this.request(
            this.route('POST', `/applications/${this.client.id}/guilds/${guildID}/commands`),
            payload
        );
    }
}
