const DiscordObject = require('./DiscordObject');

/**
 * Represents a general Discord channel.
 * This could be a text channel, DM channel, voice channel, etc.
 */
module.exports = class Channel extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        /**
         * The channel's type.
         * @see enums.ChannelType
         * @type {number}
         */
        this.type = data.type;
    }
}