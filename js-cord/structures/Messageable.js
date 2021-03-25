const Embed = require("../structures/Embed");
const getMessagePayload = require("../util/MessagePayload");

module.exports = class Messageable {
    constructor(client, id) {
        this.id = id;
        this.client = client;
        this.http = client.http;
        this.cls = null;
    }
    async send(content, options={}) {
        if (this.constructor.name.endsWith("Channel")) {
            if (!this.textBased) throw new ReferenceError(
                "Cannot send messages in this channel: Channel is not text-based.");
        }

        if (!this.cls) this.cls = require("../structures/Message");
        const payload = await getMessagePayload(content, options);
        const response = await this.http.sendMessage(this.id, payload);
        if (typeof response === "object") return new this.cls(this.client, response);
        return response.map(msg => new this.cls(client, msg));
    }
    async fetchMessage(id) {
        if (!this.cls) { this.cls = require("../structures/Message"); }
        const response = await this.http.getMessage(this.id, id);
        const msg = new this.cls(this.client, response);
        this.client.cache.addMessage(msg);
        return msg;
    }
    history(limit=100, options={}) {
        if (typeof limit === "object") {
            options = limit;
            limit = options.limit || 100;
        }
        // if (options.hasOwnProperty("around")) {

        // }
        if (!this.cls) { this.cls = require("../structures/Message"); }
        const response = this.http.getHistory(this.id);
    }
    async triggerTyping() {
        this.http.triggerTyping(this.id);
    }
}
