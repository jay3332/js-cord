const User = require("../structures/User");

class Member extends User {
    constructor(client, user_id, guild_id) {
        super(client, user_id);
    }
}

module.exports = Member;