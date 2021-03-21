const Reaction = require("../structures/Reaction");
const Channel = require("../structures/Channel");
const Member = require("../structures/Member");
const User = require("../structures/User");
const Guild = require("../structures/Guild");
const Emoji = require("../structures/Emoji");
const PartialEmoji = require("../structures/PartialEmoji");

const TYPES = ["default", "groupUserAdd", "groupUserRemove",
        "call", "groupChannelNameEdit", "groupChannelIconEdit",
        "pinned", "memberJoin", "boost", "boostLevel1", "boostLevel2", "boostLevel3",
        "channelFollowed", "discoveryDisqualified", "discoveryRequalified", "reply",
        "slashCommand"]

module.exports = class Message {
    constructor(client, data) {
        this.client = client;
        this.type = TYPES[data.type];
        this.content = data.content;
        this.id = data.id;
        this.tts = data.tts;
        this._guild_id = data.guild_id || "@me";
        this._channel_id = data.channel_id;
        this.channel = this.client.cache.getChannel(data.channel_id);
        this.guild = data.guild_id ? client.getGuild(data.guild_id) : undefined;
        this.pinned = data.pinned;

        if(data.author){if (data.author.id && this.guild) this.author = this.guild.cache.getMember(data.author.id);
        if (!this.author) this.author = this.client.getUser(data.author.id);
        if (!this.author) { let u = new User(client, data.author); this.client.cache.addUser(u); this.author = u }}

        this.createdAt = Date.parse(data.timestamp);
        this.editedAt = Date.parse(data.edited_timestamp);
        this.mentionsEveryone = data.mention_everyone;

        if (data.mentions)
            this.mentions = data.mentions.map(user => {
                let finalUser = new User(client, user);
                this.client.cache.addUser(finalUser);
                return finalUser;
            });
        if (data.mention_roles && this.guild)
            this.roleMentions = data.mention_roles.map(role_id => {
                let role = this.guild.getRole(role_id);
                this.guild.cache.addRole(role);
                return role;
            });
        if (data.mention_channels) {
            this.channelMentions = data.mention_channels.map(channelMention => this.client.cache.getChannel(channelMention.id));
        }
        if (data.reactions) this.reactions = data.reactions.map(reaction => new Reaction(client, reaction, this));
    }
    get jumpURL() {
        return `https://discord.com/channels/${this._guild_id}/${this._channel_id}/${this.id}`;
    }
    async addReaction(emoji) {
        if (typeof emoji === "string") {
            if (emoji.length > 6) {
                emoji = emoji
                    .replace(/\</g, "")
                    .replace(/\>/g, "");
                if (emoji.startsWith(":"))
                    emoji = emoji.replace(":", "");
                if (emoji.startsWith("a:"))
                    emoji = emoji.replace("a:", "");
            }
        } else if (emoji instanceof Emoji || emoji instanceof PartialEmoji) {
            if (!emoji.id) emoji = emoji.name;
            else {
                emoji = `${emoji.name}:${emoji.id}`
            }
        }
        await this.client.http.addReaction(this._channel_id, this.id, emoji);
        return this;
    }
    async addReactions(...emojis) {
        for (emoji of emojis) {
            await this.addReaction(emoji);
        }
        return this;
    }
    async reply(content, options={}) {
        options.reference = this.id;
        return await this.channel.send(content, options);
    }
    async delete() {
        await this.client.http.deleteMessage(this._channel_id, this.id);
        return this;
    }
}

    /*
    // /channels/{channel.id}/messages/{message.id}
    constructor(client, channel_id, message_id, data=null) {
        this.client = client;
        this.id = message_id;
        const payloadData = (!data) ? client.http.getMessage(channel_id, message_id) : data;
        this.parseData(payloadData);
    }
    static fromData(client, data) {
        return new Message(client, data['channel_id'], data['id'], data);
    }
    parseData(data) {
        const client = this.client;
        const message_id = this.id;
        this.channel = new Channel(client, data['channel_id']);
        // if (!!data['guild_id']) this.guild = new Guild(client, data['guild_id']);
        if (!data['member']) this.author = User.fromData(client, data['author']);
        else { this.author = (!data['member']['user']) ? User.fromData(client, data['author']) : Member.fromData(client, data['member']['user']); }
        this.content = data['content'];
        this.createdAt = Date.parse(data['timestamp']);
        this.editedAt = Date.parse(data['edited_timestamp']);
        this.tts = data['tts'];
        this.mentionsEveryone = data['mention_everyone'];
        this.mentions = data['mentions'];
        this.roleMentions = data['role_mentions'];
        this.channelMentions = data['channel_mentions'];
        this.pinned = data['pinned'];
        this.type = ["default", "groupUserAdd", "groupUserRemove",
        "call", "groupChannelNameEdit", "groupChannelIconEdit",
        "pinned", "memberJoin", "boost", "boostLevel1", "boostLevel2", "boostLevel3",
        "channelFollowed", "discoveryDisqualified", "discoveryRequalified", "reply",
        "slashCommand"][data['type']];
    }*/
