const GuildChannel = require("../structures/GuildChannel");

module.exports = class Category extends GuildChannel {
    constructor(client, data) {
        super(client, data);
    }
    get channels() {
        return this.client.cache.channels.filter(channel => channel.category.id === this.id);
    }
}