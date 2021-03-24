const GuildChannel = require("../structures/GuildChannel");

module.exports = class TextChannel extends GuildChannel {
    constructor(client, data) {
        super(client, data);
        this.slowmode = data.rate_limit_per_user;
        this.nsfw = data.nsfw;
    }
}
