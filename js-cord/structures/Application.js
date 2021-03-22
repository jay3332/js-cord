const User = require("../structures/User");

class Application {
    constructor(client, data) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.description = data.description;
        this.public = data.bot_public;
        if (data.owner) {
            this.ownerID = data.owner.id;
            let getUser = this.client.cache.getUser(this.owner.id);
            if (!getUser) {
                let user = new User(client, data.owner);
                this.client.cache.addUser(user);
                this.owner = user;
            } else {
                this.owner = getUser;
            }
        }
        if (data.team) {
            this.ownerIDs = data.team.members.map(m => m.id);
            this.teamID = data.team.id
        }
    }
    get iconAnimated() { return this.icon ? this.icon.startsWith("a_") : false }
    get defaultFormat() { return this.iconAnimated ? "gif" : "png" }
    get iconUrl() { return this.avatarUrlAs({ format: this.defaultFormat }) }

    iconUrlAs({ format, size }) {
        if (!this.icon) return undefined;

        let url = `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.`;

        format = format               ? format.toLowerCase() : this.defaultFormat;
        size   = parseAssetSize(size) ? `?size=${size}`      : "";

        let validFormats = ["png", "jpeg", "jpg", "webp"];
        if (this.iconAnimated) validFormats.push("gif");
        if (!validFormats.includes(format)) format = this.defaultFormat;
        if (format === "jpeg") format = "jpg";

        return url + format + size;
    }
}
