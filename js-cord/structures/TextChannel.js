const GuildChannel = require("../structures/GuildChannel");

module.exports = class TextChannel extends GuildChannel {
    constructor(client, data) {
        super(client, data);
        this.nsfw = data.nsfw;
    }
}
