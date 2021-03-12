const Route = require("../http/Route");
const http = require("sync-request");

class Requester {
    /**
     * Main class that sends requests to the Discord API.
     */

    constructor() {
        this.token = null;
        this.botToken = true;
        this.userAgent = 'DiscordBot (js-cord 1.0)';
    }

    request(route, body=null, contentType="application/json") {
        const method = route.method;
        let headers = {
            'Content-Type': contentType,
            'User-Agent': this.user_agent,
            'X-Ratelimit-Precision': 'millisecond',
            'Authorization': this.botToken ? `Bot ${this.token}` : this.token
        }
        if (body) body['Content-Type'] = contentType;
        const params = (!body) ? {headers: headers} : {headers: headers, body: JSON.stringify(body)};
        return JSON.parse(http(method, route.url, params).getBody('utf8'));
    }

    putToken(token, bot=true) {
        this.token = token;
        this.botToken = bot;
    }

    async login(token, bot=true) {
        this.putToken(token, bot);
        if (!this.token) return;
        let data = this.request(new Route('GET', '/users/@me'));
        return data;
    }

    logout() {
        return this.request(new Route('POST', '/auth/logout'));
    }

    sendMessage(destination_id, content=null, embed=null, tts=false, nonce=null, allowed_mentions=null, message_reference=null) {
        const route = new Route('POST', `/channels/${destination_id}/messages`);

        let payload = {};
        if (content) payload['content'] = content;
        if (tts) payload['tts'] = true;
        if (embed) payload['embed'] = embed;
        if (nonce) payload['nonce'] = nonce;
        if (allowed_mentions) payload['allowed_mentions'] = allowed_mentions;
        if (message_reference) payload['message_reference'] = message_reference;
        return this.request(route, payload);
    }

    getMessage(channel_id, message_id) {
        const route = new Route('GET', `/channels/${channel_id}/messages/${message_id}`);
        return this.request(route);
    }

    getUserInformation(user_id) {
        const route = new Route('GET', `/users/${user_id}`);
        return this.request(route);
    }

    getClientUser() {
        const route = new Route('GET', '/users/@me');
        return this.request(route);
    }

    openUserDM(user_id) {
        const route = new Route('POST', '/users/@me/channels');
        return this.request(route, {"recipient_id": user_id});
    }

}

module.exports = Requester;