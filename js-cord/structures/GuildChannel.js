const Channel = require("../structures/Channel");
const Invite = require("../structures/Invite");
const Permissions = require("../structures/Permissions");

module.exports = class GuildChannel extends Channel {
    constructor(client, data, guild) {
        super(client, data);
        this.deleted = false;
        this.id = data.id;
        this.name = data.name;
        this.guild = guild ||
                     client.getGuild(data.id) ||
                     null;
        this.position = data.position;
        if (this.guild) {
            this.category = guild.getChannel(data.parent_id) || null;
        }
    }
    get members() {
        return this.guild.members.filter(member => this.permissionsFor(member).viewChannel)
    }
    permissionsFor(member) {
        // Returns a discord.Permissions object of the permissions for a member or role,
        // this will return null
        if (this.guild) {
            if (this.guild.ownerID === member.id) {
                return Permissions.all();
            }
            
        }
    }
    overwritesFor(structure /* Member or Role */) {
        // Similar to permissionsFor but for PermissionOverwrites
        return null;
    }
    permissions(structure /* Member or Role */) {
        // Returns the calculated permissions, taking into account permissions and overwrites.
        // This will return discord.Permissions, but for now, null
        return null;
    }
    get overwrites() {
        // Returns all overwrites for this channel.
        return null;
    }
    rename(name, reason=null) {
        // Shortcut to edit the name for this channel
        return this.edit({ name: name }, reason);
    }
    setPermissions(permissions, reason=null) {
        // Shortcut to change permissions for this channel
        let overwrites;
        if (typeof permissions === "object") {
            overwrites = permissions.overwrites;
            permissions = permissions.permissions;
        }
        if (!overwrites) return this.edit({ permissions: permissions }, reason);
        return this.edit({ permnissions: permissions, overwrites: overwrites }, reason);
    }
    edit({ name, topic, slowmode, permissions, overwrites, category, synced, nsfw, bitrate, userLimit }={}, reason=null) {

    }
    createInvite({ temporary = false, maxAge = 86400, maxUses = 0, unique, reason } = {}) {
        const response = this.client.http.createInvite(this.id, {
            data: {
                temporary: temporary,
                max_age: maxAge,
                max_uses: maxUses,
                unique: unique
            },
            reason: reason
        });
        return new Invite(this.client, response);
    }
    invites() {

    }
    clone(name, reason) {
        if (!name) name=this.name;
        return this.guild.createChannel(
            name, {
                overwrites: this.overwrites,
                topic: this.topic,
                nsfw: this.nsfw,
                parent: this.parent,
                bitrate: this.bitrate,
                userLimit: this.userLimit,
                slowmode: this.slowmode,
                reason: reason,
            }
        );
    }

}

/*
    parseData(data) {
        const client = this.client;
        const channel_id = this.id;
        this.type = ['text', 'dm', 'voice', 'group', 'category', 'news', 'store'][data['type']];
        if (data['guild_id']) this.guild = new Guild(client, data['guild_id']);
        this.position = data['position'];
        this.name = data['name'];
        this.topic = data['topic'];
        this.nsfw = data['nsfw'];
        if (!!data['message_id']) this.lastMessage = new Message(client, channel_id, data['message_id']);
        this.bitrate = data['bitrate'];
        this.maxUsers = data['user_limit'];
        this.slowmode = data['rate_limit_per_user'];
        this.users = data['recipients'];
        this.iconHash = data['icon']; // wait a channel has an icon? gc
        if (!!data['owner_id']) this.owner = new User(client, data['owner_id']);
        // this.category = new Category(client, data['parent_id']);
        this.lastPinTimestamp = Date.parse(data['last_pin_timestamp']);
        this.mention = `<#${channel_id}>`;
        this.createdAt = Util.parseSnowflake(channel_id);
    }
    static fromData(client, data) {
        return new Channel(client, data['id'], data);
    }
    */
