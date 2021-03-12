const Reaction = require("../structures/Reaction");

class Message {
    // /channels/{channel.id}/messages/{message.id}
    constructor(client, channel_id, message_id) {
        this.client = client;
        const data = client.http.getMessage(channel_id, message_id);
        this.id = data['id'];
        this.
    }
}

module.exports = Message;