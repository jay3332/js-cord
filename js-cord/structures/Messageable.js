const Embed = require("../structures/Embed");
const Message = require("../structures/Message");

module.exports = class Messageable {
    constructor(client, id) {
        this.id = id;
        this.client = client;
        this.http = client.http;
    }
    send(content, options={}) {
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

        const response = this.http.sendMessage(this.id, content.toString(), embed, tts);
        return Message.fromData(this.client, response);
    }
    fetchMessage(id) {
        return Message.fromData(this.client, this.http.getMessage(this.id, id));
    }
    history(limit=100, options={}) {
        if (typeof limit === "object") {
            options = limit;
            limit = options.limit || 100;
        }
        // if (options.hasOwnProperty("around")) {
         
        // }
        const response = this.http.getHistory(this.id);
    }
    triggerTyping() {
        this.http.triggerTyping(this.id);
    }
}