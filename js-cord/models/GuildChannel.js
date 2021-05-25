const Channel = require('./Channel');

module.exports = class GuildChannel extends Channel {
    constructor(client, data) {
        super(client, data);
        if (data) this.loadData(data);
    } 

    loadData(data) {
        this.guild = this.client.getGuild(data.guild_id);
        this.position = data.position;
        this.name = data.name;
    }
}