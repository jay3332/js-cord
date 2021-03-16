const Guild = require("../structures/Guild");
const GuildChannel = require("../structures/GuildChannel");
const User = require("../structures/User");

module.exports = class Invite {
    constructor(client, data) {
        this.uses = data.uses;
        this.maxUses = data.max_uses;
        this.maxAge = data.max_age*1000 || null;
        this.temporary = data.temporary;
        this.createdAt = Date.parse(data.created_at);
        this.code = data.code;
        this.guild = new Guild(client, data.guild);
        this.channel = new GuildChannel(client, data.channel);
        this.author = new User(client, data.user);
    }
} 
