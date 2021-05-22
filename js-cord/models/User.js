const Asset = require('./Asset');
const Object = require('./Object');


module.exports = class User extends Object {
    constructor(client, data) {
        this.#client = client;
        this.#rawData = data;
        if (data) this.loadData(data);
    }
    
    loadData(data) {
        super(data.id);
        this.name = data.username;
        this.discriminator = data.discriminator;
        this.avatar = new Asset(`avatars/${data.id}`, data.avatar);
        this.bot = data.bot;
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