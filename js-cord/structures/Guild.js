const Util = require("../util/Util");
const Member = require("../structures/Member");
const User = require("../structures/User");
const Role = require("../structures/Role");
const { GuildCache } = require('../client/Cache');
const { parseSnowflake, parseAssetSize } = Util;
const GuildChannel = require("../structures/GuildChannel");
const TextChannel = require("../structures/TextChannel");
const VoiceChannel = require("../structures/VoiceChannel");
const Category = require("../structures/Category")

module.exports = class Guild {
    constructor(client, data, cache) {
        this.id = data.id;
        this.name = data.name;
        this.client = client;
        this.cache = cache || new GuildCache();
        this.icon = data.icon;
        this.ownerId = data.owner_id;

        if (this.id) this.createdAt = parseSnowflake(this.id);
        if (data.members) {
            data.members.forEach(member => {
                let memberStruct = new Member(
                    this.client, 
                    member, 
                    member.user,
                    this
                );
                let userStruct = new User(this.client, member.user);
                this.cache.addMember(memberStruct);
                this.client.cache.addUser(userStruct);
            });
        } 
        if (data.roles) {
            data.roles.forEach(role => {
                this.cache.addRole(new Role(this.client, role, this));
            });
        }
        if (data.channels) {
            data.channels.forEach(channel => {
                let c;
                if (channel.type === 2) {
                    c = new VoiceChannel(this.client, channel, this);
                } else if (channel.type === 4) {
                    c = new Category(this.client, channel, this);
                } else if (channel.type < 6) {
                    c = new TextChannel(this.client, channel, this);
                } else {
                    c = new GuildChannel(this.client, channel, this);
                }
                this.client.cache.addChannel(c);
            });
        }
        if (data.emojis) {
            
        }
    }
    get owner() {
        return this.getMember(this.ownerId);
    }
    get isOwner() {
        return this.ownerId === this.client.user.id;
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
    get categories() {
        return this.channels.filter(channel => !!channel.channels);
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
    asMember(user) {
        return this.getMember(user.id);
    }
    get me() {
        return this.asMember(this.client.user)
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
}