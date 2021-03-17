const User = require("../structures/User");

class Member extends User {
    constructor(client, userData, memberData) {
        super(client, userData);
        this.nick = memberData.nick;
        this.joinedAt = Date.parse(memberData.joined_at);
        this.boostingSince = memberData.premium_since ? Date.parse(memberData.premium_since) : undefined;
        this.pending = data.pending;
       
    }
}

module.exports = Member;