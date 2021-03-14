const Util = require("../util/Util");
const Member = require("../structures/Member");

module.exports = class Guild {
    constructor(client, guild_id) {
        this.id = guild_id;
        this.createdAt = Util.parseSnowflake(guild_id);
        const data = client.http.getGuild(guild_id);
        this.name = data['name'];
        this.iconHash = data['icon'];
        try { this.iconAnimated = this.iconHash.startsWith("a_") } catch (e) {
            this.iconAnimated = false;
        };
        const defaultFormat = this.iconAnimated ? "gif" : "png";
        this.iconUrl = `https://cdn.discordapp.com/avatars/${this.id}/${this.iconHash}.${defaultFormat}`;
        this.isOwner = data['owner'];
        this.owner = new Member(client, data['owner_id'], guild_id);
        
    }
}