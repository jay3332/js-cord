const User = require("../structures/User");
//vconst Role = require("../structures/Role");

class Member extends User {
    constructor(client, userData, memberData, guild) {
        super(client, userData);
        this.client = client;
        this.nick = memberData.nick;
        this.joinedAt = Date.parse(memberData.joined_at);
        this.boostingSince = memberData.premium_since ? Date.parse(memberData.premium_since) : undefined;
        this.pending = memberData.pending;
        this.roles = memberData.roles.map(role => guild.cache.getRole(role.id)).sort((a, b) => {
            return a.position > b.position ? 1 : (a.position < b.position ? -1 : 0)
        });
        this.permissions = null;
        this.guild = guild;
    }
    get topRole() {
        return this.roles[-1];
    }
    get kickable() {
        if (this.guild.isOwner) return true;
        return this.guild.me.permissions.kickMembers && this.topRole.position<this.guild.me.topRole.position;
    }
    get bannable() {
        if (this.guild.isOwner) return true;
        return this.guild.me.permissions.banMembers && this.topRole.position<this.guild.me.topRole.position;
    }
}

module.exports = Member;