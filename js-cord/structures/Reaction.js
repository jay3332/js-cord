const PartialEmoji = require("../structures/PartialEmoji");
const User = require("../structures/User");

class Reaction {
    constructor(client, data, message) {
        this.client = client;
        this.count = data.count;
        this.me = data.me;
        this.emoji = new PartialEmoji(data.emoji);
        this.message = message;
        this.channel = message.channel;
    }
    toString() {
        return this.emoji.toString();
    }
    async users() {
        let emoji = this.emoji.requestEmoji;
        let result = await this.client.http.getReactionUsers(this.channel.id, this.message.id, emoji);
        return result.map(user => new User(this.client, user));
    }
}

module.exports = Reaction;