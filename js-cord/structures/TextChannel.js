const GuildChannel = require("../structures/GuildChannel");
const Webhook = require("../structures/Webhook");

module.exports = class TextChannel extends GuildChannel {
    constructor(client, data) {
        super(client, data);
        this.slowmode = data.rate_limit_per_user;
        this.nsfw = data.nsfw;
    }
    async createWebhook(name, options) {
        if (typeof name === "object") {
            options = name;
            name = options.name;
        }
        if (!name) throw new Error("Webhooks must have a name.");
        return new Webhook(
            await this.client.http.createWebhook(this.id, name, options.avatar || null, options.reason || null)
        )
    }
}
