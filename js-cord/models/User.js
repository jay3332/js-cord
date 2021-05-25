const Asset = require('./Asset');
const DiscordObject = require('./DiscordObject'); 

module.exports = class User extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }
    
    loadData(data) {
        this.name = data.username;
        this.discriminator = data.discriminator;
        this.avatar = new Asset(`avatars/${data.id}`, data.avatar);
        this.bot = data.bot;
        this.system = data.system;
    }

    get tag() {
        return `${this.name}#${this.discriminator}`
    }
    
    get mention() {
        return `<@${this.id}>`
    }

    get displayName() {
        return this.name
    }

    toString() {
        return this.tag;
    }

    get avatarAnimated() {
        return this.avatar.animated
    }

    get defaultFormat() {
        return this.avatar.defaultFormat
    }

    get avatarURL() {
        return this.avatar.url;
    }

    avatarUrlAs(options) {
        return this.avatar.urlAs(options);
    }
}