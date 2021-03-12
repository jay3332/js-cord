const Util = require('../util/Util');
const Messageable = require('../structures/Messageable');

class User extends Messageable {
    constructor(client, user_id) {
        let channelData = null;
        client.http.openUserDM(user_id).then(res => channelData = res);
        super(client, channelData['id']);
        this.client = client;
        this.input_id = user_id;
        let data = null;
        client.http.getUserInformation(user_id).then(res => data = res);
        console.log(data);

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
}

module.exports = User;