const GuildChannel = require("../structures/GuildChannel");

module.exports = class VoiceChannel extends GuildChannel {
    constructor(client, data) {
        super(client, data);

    }
}