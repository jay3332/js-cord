const Util = require('../util/Util');
const Messageable = require('../structures/Messageable');
const DMChannel = require('../structures/DMChannel');

class User {
    constructor(client, user_id) {
        this.dmChannel = null;
        this.client = client;
        this.input_id = user_id;
        const data = client.http.getUserInformation(user_id);

        this.id = data['id'];
        this.name = data['username'];
        this.discriminator = data['discriminator'];
        this.avatarHash = data['avatar'];
        this.avatarAnimated = this.avatarHash.startsWith("a_");
        const defaultFormat = this.avatarAnimated ? "gif" : "png";
        this.avatarUrl = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatarHash}.${defaultFormat}`;

        this.bot = data['bot'];
        this.tag = `${this.name}#${this.discriminator}`;
        this.createdAt = Util.parseSnowflake(this.id);
        this.flagValue = data['flags'];
        this.premiumType = data['premium_type'];
        this.publicFlagValue = data['public_flags'];
    }
    toString() {
        return this.tag;
    }
    avatarUrlAs(format) {
        format = format.toLowerCase().trim(".");
        if (!['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(format)) throw new Error("Invalid format.");
        if (format === "jpeg") format = 'jpg';
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatarHash}.${format}`;
    }
    openDM() {
        const channelData = this.client.http.openUserDM();
        this.dmChannel = new DMChannel(this.client, channelData['id'], this);
    }
    send(...args) {
        if (!this.dmChannel) {
            this.openDM();
        }
        this.dmChannel.send(...args);
    }
}

module.exports = User;