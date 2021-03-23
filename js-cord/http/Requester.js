const Route = require("../http/Route");
// const needle = require("needle");
const zlib = require("zlibjs");
const handleEvent = require("../http/EventHandler");
const http = require("node-fetch");
const ws = require("ws");

class Requester {
    /**
     * Main class that sends requests to the Discord API.
     * This, is for some reason, also merged with websockets.
     */

    constructor(client) {
        this.client =  client;
        this.token = null;
        this.botToken = true;
        this.userAgent = 'DiscordBot (js-cord 1.0)';
        this.latencies = [];
        this.lastPing = null;
    };

    async request(route, reqbody, contentType="application/json") {
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

        /* const response = needle.request(method, route.url, (reqbody || {}), {json: true, headers: headers}, (
            err, { body }
        ) => {
            if (err) throw err;
            else return body;
        }); */
        //console.log(response);
        // return response;

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

    async establishGateway() {
        let route = new Route('GET', '/gateway/bot');
        const response = this.request(route);
        const extension = "?v=8&encoding=json";
        const url = !!response['url']
                    ? (response['url'] + extensions)
                    : "wss://gateway.discord.gg/?"+extension;
        this.client.ws = new ws(url);
        await this.setupWebsocket();
    }

    async setupWebsocket () {
        this.client.ws.on('message', async (data) => {
            //console.log(data);
            if (typeof data !== "object") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                data = JSON.parse(new zlib.RawInflate(data).decompress());
            }}
            await this.parseWebsocketData(data);
        });
    }

    async parseWebsocketData(data) {
        const payloadData = data.d;
        const op = parseInt(data.op);
        if (!data) return;
        if (op === 0) {
            // it's an event
            await handleEvent(this.client, data.t, payloadData);
        } else if (op == 1) {
            // it's a heartbeat, we should send one back.
            // we should also start timing:
            this.lastPing = parseFloat(process.hrtime().join("."));
            this.client.ws.send(JSON.stringify({
                op: 1, sequence: data.s
            }));
        } else if (op == 10) {
            //console.log("ok");
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
            /*
            this.lastPing = parseFloat(process.hrtime().join("."));
            this.client.ws.send(JSON.stringify({
                op: 1, sequence: data.s
            })); */
        } else if (op == 11) {
            // nice, we got a heartbeat ack, this means things went well.
            if (this.lastPing) {
                let current = parseFloat(process.hrtime().join("."));
                this.latencies.push(current - this.lastPing);
            }
        }
    }

    async login(token, bot=true) {
        this.putToken(token, bot);
        if (!this.token) return;
        let data = await this.request(new Route('GET', '/users/@me'));
        return data;
    }

    async logout() {
        return await this.request(new Route('POST', '/auth/logout'));
    }

    async getApplicationInfo() {
        const route = new Route('GET', '/oauth2/applications/@me');
        return await this.request(route);
    }

    async sendMessage(destination_id, content="", embed=null, tts=false, nonce=null, allowed_mentions=null, message_reference=null) {
        const route = new Route('POST', `/channels/${destination_id}/messages`);

        let payload = {};
        if (content) payload['content'] = content;
        if (tts) payload['tts'] = true;
        if (embed) payload['embed'] = embed;
        if (nonce) payload['nonce'] = nonce;
        if (allowed_mentions) payload['allowed_mentions'] = allowed_mentions;
        if (message_reference) payload['message_reference'] = { message_id: message_reference };
        return await this.request(route, payload);
    }

    async getMessage(channel_id, message_id) {
        const route = new Route('GET', `/channels/${channel_id}/messages/${message_id}`);
        return await this.request(route);
    }

    async deleteMessage(channel_id, message_id) {
        const route = new Route('DELETE', `/channels/${channel_id}/messages/${message_id}`);
        return await this.request(route);
    }

    async getHistory(channel_id) {
        const route = new Route('GET', `/channels/${channel_id}/messages`);
        return await this.request(route);
    }

    async triggerTyping(channel_id) {
        const route = new Route('POST', `/channels/${channel_id}/typing`);
        return await this.request(route);
    }

    async getUserInformation(user_id) {
        const route = new Route('GET', `/users/${user_id}`);
        return await this.request(route);
    }

    async getClientUser() {
        const route = new Route('GET', '/users/@me');
        return await this.request(route);
    }

    async openUserDM(user_id) {
        const route = new Route('POST', '/users/@me/channels');
        return await this.request(route, {"recipient_id": user_id});
    }

    async getChannel(channel_id) {
        const route = new Route('GET', `/channels/${channel_id}`);
        return await this.request(route);
    }

    async getGuild(guild_id) {
        const route = new Route('GET', `/guilds/${guild_id}`);
        return await this.request(route);
    }

    async deleteChannel(channel_id) {
        const route = new Route('DELETE', `/channels/${channel_id}`);
        return await this.request(route);
    }

    async createInvite(channel_id, options) {
        const route = new Route('POST', `/channels/${channel_id}/invites`);
        return await this.request(route, options);
    }

    // webhooks

    async webhookSend(webhook_id, webhook_token, options) {
      const route = new Route('POST', `/webhooks/${webhook_id}/${webhook_token}`);
      return await this.request(route, options);
    }

    // guilds

    async createGuild(name, icon, region, roles, channels) {
        const route = new Route('POST', '/guilds');
        return await this.request(route, {
            name: name,
            icon: icon || null,
            region: region || null,
            roles: roles || null,
            channels: channels || null
        })
    }

    async deleteGuild(guild_id) {
        const route = new Route('DELETE', `/guilds/${guild_id}`);
        return await this.request(route);
    }

    // roles

    async getRole(guild_id, role_id) {
        const route = new Route('GET', `/guilds/${guild_id}/roles/${role_id}`);
        return await this.request(route);
    }

    async editRole(guild_id, role_id, options) {
        const route = new Route('PATCH', `/guilds/${guild_id}/roles/${role_id}`);
        return await this.request(route, options);
    }

    async deleteRole(guild_id, role_id) {
        const route = new Route('DELETE', `/guilds/${guild_id}/roles/${role_id}`);
        return await this.request(route);
    }

    // emojis

    async getReactionUsers(channel_id, message_id, emoji) {
        let encoded = encodeURIComponent(emoji);
        const route = new Route('GET', `/channels/${channel_id}/messages/${message_id}/reactions/${encoded}`);
        return await this.request(route);
    }

    async removeUserReaction(channel_id, message_id, user_id, emoji) {
        let encoded = encodeURIComponent(emoji);
        const route = new Route('DELETE',  `/channels/${channel_id}/messages/${message_id}/reactions/${encoded}/${user_id || '@me'}`);
        return await this.request(route);
    }

    async createEmoji(guild_id, payload) {
        const route = new Route('POST', `/guilds/${guild_id}/emojis`);
        return await this.request(route, payload);
    }

    async editEmoji(guild_id, emoji_id, payload) {
        const route = new Route('PATCH', `/guilds/${guild_id}/emojis/${emoji_id}`);
        return await this.request(route, payload);
    }

    async deleteEmoji(guild_id, emoji_id) {
        const route = new Route('DELETE', `/guilds/${guild_id}/emojis/${emoji_id}`);
        return await this.request(route);
    }

    // slash commands (kinda cringe)

    async getGlobalSlashCommands(application_id) {
        const route = new Route('GET', `/applications/${application_id || this.client.id}/commands`);
        return await this.request(route);
    }

    async getGuildSlashCommands(application_id, guild_id) {
        const route = new Route('GET', `/applications/${application_id || this.client.id}/guilds/${guild_id}/commands`);
        return await this.request(route);
    }

}

module.exports = Requester;
