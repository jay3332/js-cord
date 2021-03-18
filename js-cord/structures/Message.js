const Reaction = require("../structures/Reaction");
const Channel = require("../structures/Channel");
const Member = require("../structures/Member");
const User = require("../structures/User");
const Guild = require("../structures/Guild");

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
        this.channel = this.client.getChannel(data.channel_id);
        this.guild = data.guild_id ? client.getGuild(data.guild_id) : undefined;
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
        this.pinned = data.pinned;
        if (data.reactions) this.reactions = data.reactions.map(reaction => new Reaction(client, reaction, this));
    }
    async addReaction(emoji) {
        if (typeof emoji === "string") {
            if (emoji.match(/\<?a?:?[a-zA-Z0-9_]{2,32}:\d{17,}\>?/)) {
                
            }
        } else {}
    }
    async addReactions(...emojis) {
        for (emoji of emojis) {
            await this.addReaction(emoji);
        }
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
