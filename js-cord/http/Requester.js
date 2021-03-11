const Route = require("../http/Route");
const http = require("node-fetch");

class Requester {
    /**
     * Main class that sends requests to the Discord API.
     */

    constructor() {
        this.token = null;
        this.botToken = true;
        this.userAgent = 'js-cord Discord Bot';
        this.response = null;
    }

    request(route, json=null) {
        this.method = route.method;
        headers = {
            'User-Agent': this.user_agent,
            'X-Ratelimit-Precision': 'millisecond',
            'Authorization': this.botToken ? `Bot ${this.token}` : this.token
        }
        if (!json) {
            http(route.url, {method: this.method, headers: headers}).then(response => {
                this.response = response
            });
        } else {
            http(route.url, {method: this.method, headers: headers, body: JSON.stringify(json)}).then(response => {
                this.response = response
            });
        }
    }

    putToken(token, bot=true) {
        this.token = token;
        this.botToken = bot;
    }

    login(token, bot=true) {
        this.putToken(token, bot);
        if (!this.token) return;
        let data = this.request(Route('GET', '/users/@me'));
        return data;
    }

    logout() {
        return this.request(Route('POST', '/auth/logout'));
    }

    sendMessage(destination_id, content=null, tts=false, embed=null, nonce=null, allowed_mentions=null, message_reference=null) {
        route = Route('POST', `/channels/${channel_id}/messages`);

        payload = {};
        if (!!content) payload['content'] = content;
        if (tts) payload['tts'] = true;
        if (!!embed) payload['embed'] = embed;
        if (!!nonce) payload['nonce'] = nonce;
        if (!!allowed_mentions) payload['allowed_mentions'] = allowed_mentions;
        if (!!message_reference) payload['message_reference'] = message_reference;
        return this.request(route, payload);
    }

}