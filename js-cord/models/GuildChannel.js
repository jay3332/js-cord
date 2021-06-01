const Channel = require('./Channel');

/**
 * Represents a channel that's present in a guild.
 */
module.exports = class GuildChannel extends Channel {
    constructor(client, data) {
        super(client, data);
        if (data) this.loadData(data);
    } 

    loadData(data) {
        /**
         * The guild this channel is in.
         * @type {?Guild}
         */
        this.guild = this.client.getGuild(data.guild_id);
        
        /**
         * The position of the channel.
         * @type {number}
         */
        this.position = data.position;
        
        /**
         * The name of the channel.
         * @type {string}
         */
        this.name = data.name;
    }
}