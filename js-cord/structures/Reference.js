const Message = require("../structures/Message");

module.exports = class Reference {
    constructor(client, data) {
        this.client = client;
        this.message_id = data.message_id;
        this.channel_id = data.channel_id;
        this.guild_id = data.guild_id;
        this.resolved = undefined;
    }
    async resolve() {
        // fetches from http
        const response = await this.client.http.getMessage(this.channel_id, this.message_id);
        const msg =  new Message(this.client, response);
        this.client.cache.addMessage(msg);
        this.resolved = msg;
        return msg;
    }
    get jumpURL() {
        const guild_id = this.guild_id || "@me";
        return `https://discord.com/channels/${guild_id}/${this.channel_id}/${this.message_id}`;
    }
    static fromMessage(message) {
        const guild_id = message._guild_id === "@me" ? undefined : message._guild_id;
        return new Reference(message.client, {
            message_id: message.id,
            channel_id: message._channel_id,
            guild_id: guild_id
        });
    }
}
