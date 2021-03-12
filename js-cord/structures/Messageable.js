/**
 * Represents something that you can send to.
 * These will extend this class.
 */

const Embed = require("../structures/Embed");

class Messagable {
    constructor(client, channel_id) {
        this.client = client;
        this.type = "channel";
        this.channel_id = channel_id
    }
    send(content, options={}) {
        
        if (typeof content == "object") {
            content = content.content;
            options = content;
        }
        if (!content) content = '';
        if (options.hasOwnProperty("embed")) {
            if (options.embed instanceof Embed) {
                const embed = options.embed.asJSON;
            } else const embed = null; 
        }

        this.client.http.sendMessage(this.channel_id, content, embed);

    }
}

module.exports = Messagable;