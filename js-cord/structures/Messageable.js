const Embed = require("../structures/Embed");

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

        if (!this.cls) { this.cls = require("../structures/Message"); }
        if (typeof content == "object") {
            options = content;
            content = content.content;
        }

        let allOptions = [];
        if (!content) content = '';
        else allOptions.push("content");

        let embed = null;
        let tts = false;
        let reference = null;
        if (options.embed instanceof Embed) {
            embed = options.embed.json;
            allOptions.push("embed");
        }
        if (typeof options.tts === "boolean") {
            tts = options.tts;
            allOptions.push("tts");
        }
        if (typeof options.reference === "string") {
            reference = options.reference;
            allOptions.push("reference");
        } else if (options.reference instanceof this.cls) {
            reference = options.reference.id;
            allOptions.push("reference");
        }

        try { content = content.toString() } catch(_){}

        const response = await this.http.sendMessage(this.id, content, embed, tts, null, null, reference);
        return new this.cls(this.client, response);
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
