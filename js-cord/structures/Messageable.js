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

        let embed = null;
        if (options.hasOwnProperty("embed")) {
            if (options.embed instanceof Embed) {
                embed = options.embed.asJSON;
            }  
        }

        this.client.http.sendMessage(this.channel_id, content, embed);

    }
}

module.exports = Messagable;