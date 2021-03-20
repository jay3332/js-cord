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

        if (typeof content == "object") {
            options = content;
            content = content.content;
        }

        let allOptions = [];
        if (!content) content = '';
        else allOptions.push("content");

        let embed = null;
        let tts = false;
        if (options.hasOwnProperty("embed") &&
            options.embed instanceof Embed) {
            embed = options.embed.json;
            allOptions.push("embed");
        }
        if (options.hasOwnProperty("tts") &&
            typeof options.tts === "boolean") {
            tts = options.tts;
            allOptions.push("tts");
        }

        try { content = content.toString() } catch(_){}
        if (!this.cls) { this.cls = require("../structures/Message"); }
        const response = await this.http.sendMessage(this.id, content, JSON.stringify(embed), tts);
        return new this.cls(this.client, response);
    }
    async fetchMessage(id) {
        if (!this.cls) { this.cls = require("../structures/Message"); }
        return new this.cls(this.client, this.http.getMessage(this.id, id));
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
