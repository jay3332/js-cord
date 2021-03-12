const Reaction = require("../structures/Reaction");

class Message {
    constructor(channel, data) {
        this.id = data['id'];
    }
}

module.exports = Message;