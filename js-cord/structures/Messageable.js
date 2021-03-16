const Embed = require("../structures/Embed");

module.exports = class Messageable {
    constructor(client, id) {
        this.id = id;
        this.client = client;
        this.http = client.http;
        this.cls = null;
    }
    send(content, options={}) {
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
            embed = options.embed.asJSON;
            allOptions.push("embed"); 
        }
        if (options.hasOwnProperty("tts") &&
            typeof options.tts === "boolean") {
            tts = options.tts;
            allOptions.push("tts");
        }

        if (!this.cls) { this.cls = require("../structures/Message"); }
        const response = this.http.sendMessage(this.id, content.toString(), embed, tts);
        return this.cls.fromData(this.client, response);
    }
    fetchMessage(id) {
        if (!this.cls) { this.cls = require("../structures/Message"); }
        return this.cls.fromData(this.client, this.http.getMessage(this.id, id));
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
    triggerTyping() {
        this.http.triggerTyping(this.id);
    }
}