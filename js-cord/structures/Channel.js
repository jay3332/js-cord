/**
 * Represents something that you can send to.
 * These will extend this class.
 */

const Embed = require("../structures/Embed");
const Message = require("../structures/Message");
const Messageable = require("../structures/Messageable");
const User = require("../structures/User");
const Guild = require("../structures/Guild");
const Util = require("../util/Util");

class Channel extends Messageable {
    constructor(client, channel_id, data=null) {
        super(cilent, channel_id);
        this.client = client;
        this.id = channel_id;
        const data = (!data) ? client.http.getChannel(channel_id) : data;
        this.parseData(data);
    }
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
}

module.exports = Channel;