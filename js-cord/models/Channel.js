/**
 * Note: This means a text-based channel. 
 * Voice channels are in it's own class.
 */

const DiscordObject = require('./DiscordObject');

module.exports = class Channel extends DiscordObject {
    constructor(client, data) {
        this.client = client;
        this.rawData = data;
        if (data) {
            this.loadData(data);
            super(data.id);
        }
    }

    loadData(data) {
        this.type = data.type;
    }

    async send(content, options) {
        if (typeof content === 'object') {
            options = content;
            content = undefined;
        }
        options.content = content;
        
    }
}