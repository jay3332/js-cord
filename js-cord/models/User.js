const Asset = require('../models/Asset');


module.exports = class User {
    constructor(client, data) {
        this._client = client;
        this._rawData = data;
        if (data) this.loadData(data);
    
    }
    
    loadData(data) {
        this.id = data.id;
        this.name = data.username;
        this.discriminator = data.discriminator;
        this.avatar = new Asset(`avatars/${this.id}`, data.avatar);
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