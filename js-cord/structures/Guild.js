const Util = require("../util/Util");
const Member = require("../structures/Member");
const Roles = require("../structures/Role");
const { GuildCache } = require('../client/Cache');
const { parseSnowflake, parseAssetSize } = Util;

module.exports = class Guild {
    constructor(client, data, cache) {
        this.id = data.id;
        this.name = data.name;
        this.client = client;
        this.cache = cache || new GuildCache();
        this.icon = data.icon;

        this.owner = this.getMember(data.owner_id);
        this.isOwner = data.owner;

        if (this.id) this.createdAt = parseSnowflake(this.id);
    }
    get channels() {
        return this.client.cache.channels.filter(channel => channel.guild.id===this.id);
    }
    get textChannels() {
        return this.channels.filter(channel => channel.textBased);
    }
    get voiceChannels() {
        return this.channels.filter(channel => !channel.textBased);
    }
    get members() {
        return this.cache.members
    }
    get roles() {
        return this.cache.roles
    }
    get emojis() {
        return this.cache.emojis
    }
    getMember(id) {
        const res = this.cache.getMember(id);
        if (res) return res;
        return undefined;
    }
    getRole(id) {
        const res = this.cache.getRole(id);
        if (res) return res;
        return undefined;
    }
    getEmoji(id) {
        const res = this.cache.getEmoji(id);
        if (res) return res;
        return undefined;
    }

    get iconAnimated() { return this.icon ? this.icon.startsWith("a_") : false }
    get defaultFormat() { return this.iconAnimated ? "gif" : "png" }
    get iconUrl() { return this.avatarUrlAs({ format: this.defaultFormat }) }
    
    iconUrlAs({ format, size }) {
        if (!this.icon) return undefined;

        let url = `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.`;

        format = format               ? format.toLowerCase() : this.defaultFormat;
        size   = parseAssetSize(size) ? `?size=${size}`      : "";
        
        let validFormats = ["png", "jpeg", "jpg", "webp"];
        if (this.iconAnimated) validFormats.push("gif");
        if (!validFormats.includes(format)) format = this.defaultFormat; 
        if (format === "jpeg") format = "jpg";

        return url + format + size;
    }

    /*
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
    */
}