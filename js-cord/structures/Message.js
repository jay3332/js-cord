const Reaction = require("../structures/Reaction");
const Channel = require("../structures/Channel");
const Member = require("../structures/Member");
const User = require("../structures/User");
const Guild = require("../structures/Guild");

module.exports = class Message {
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
        else { this.author = Member.fromData(client, data['member']['user']); }
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
    }
}
