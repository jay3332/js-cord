const GuildChannel = require('./GuildChannel');
const MessageBuilder = require('./MessageBuilder');

module.exports = class TextChannel extends GuildChannel {
    constructor(client, data) {
        super(client, data);
        if (data) this.loadData(data);
    } 

    loadData(data) {
        this.topic = data.topic;
        this.nsfw = data.nsfw;
        this.lastMessage = this.getMessage(data.last_message_id);
    }

    getMessage(id) {
        let cache = this.client.cache.messages;
        return cache.find(msg => msg.channel.id == this.id && msg.id == id);
    }

    async send(content, options) {
        let builder = new MessageBuilder(this, content, options, 'send');
        return await builder.build().send();
    }
}