const GuildChannel = require("../structures/GuildChannel");

module.exports = class TextChannel extends GuildChannel {
    constructor(client, channel_id) {
        super(client, channel_id);
        
    }
}