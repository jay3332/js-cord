const Route = require("../http/Route");
const needle = require("needle");
const zlib = require("zlibjs");
const handleEvent = require("../http/EventHandler")
const ws = require("ws");

class Requester {
    /**
     * Main class that sends requests to the Discord API.
     */

    constructor(client) {
        this.client =  client;
        this.token = null;
        this.botToken = true;
        this.userAgent = 'DiscordBot (js-cord 1.0)';
    };

    request(route, reqbody = null, contentType="application/json") {
        let method = route.method.toLowerCase();
        let headers = {
            'Content-Type': contentType,
            'User-Agent': this.userAgent,
            'X-Ratelimit-Precision': 'millisecond',
            'Authorization': this.botToken ? `Bot ${this.token}` : this.token
        }
        if (reqbody) reqbody['Content-Type'] = contentType;

        const response = needle.request(method, route.url, (reqbody || {}), {json: true, headers: headers}, (
            err, { body }
        ) => {
            if (err) throw err;
            else return body;
        });
        //console.log(response);
        return response;

        // return JSON.parse(http(method, route.url, params).getBody('utf8'));
        
        /* const params = body 
            ? {headers, body: JSON.stringify(body)}
            : {headers};

        return https.request({
            method,
            hostname: route.base,
            path: route.path,
            
        }); */
    }

    putToken(token, bot=true) {
        this.token = token;
        this.botToken = bot;
    }

    establishGateway() {
        let route = new Route('GET', '/gateway/bot');
        const response = this.request(route);
        const extension = "?v=8&encoding=json";
        const url = (!!response['url']) ? (response['url'] + extensions) : "wss://gateway.discord.gg/?"+extension;
        this.client.ws = new ws(url);
        this.setupWebsocket();
    }

    setupWebsocket () {
        this.client.ws.on('message', data => {
            //console.log(data);
            if (typeof data !== "object") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                data = JSON.parse(new zlib.RawInflate(data).decompress());
            }}
            this.parseWebsocketData(data);
        });
    }

    parseWebsocketData(data) {
        const payloadData = data.d;
        const op = parseInt(data.op);
        if (!data) return;
        if (op === 0) {
            // it's an event
            handleEvent(this.client, data.t, payloadData);
        } else if (op == 10) {
            this.client.ws.send(JSON.stringify({
                op: 2,
                d: {
                    token: this.token,
                    intents: 513,
                    properties: {
                        os: "linux",
                        '$browser': "js-cord",
                        '$device': "js-cord"
                    }
                }
            }));
            setInterval(() => {
                this.client.ws.send(JSON.stringify({
                    op: 1,
                    sequence: data.s
                }));
            }, data.heartbeat_interval);
            
        }
    }

    login(token, bot=true) {
        this.putToken(token, bot);
        if (!this.token) return;
        let data = this.request(new Route('GET', '/users/@me'));
        return data;
    }

    logout() {
        return this.request(new Route('POST', '/auth/logout'));
    }

    sendMessage(destination_id, content="", embed=null, tts=false, nonce=null, allowed_mentions=null, message_reference=null) {
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

    getHistory(channel_id) {
        const route = new Route('GET', `/channels/${channel_id}/messages`);
        return this.request(route);
    }

    triggerTyping(channel_id) {
        const route = new Route('POST', `/channels/${channel_id}/typing`);
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

    getChannel(channel_id) {
        const route = new Route('GET', `/channels/${channel_id}`);
        return this.request(route);
    }

    getGuild(guild_id) {
        const route = new Route('GET', `/guilds/${guild_id}`);
        return this.request(route);
    }

}

module.exports = Requester;