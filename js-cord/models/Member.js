const User = require('./User');
//const Guild = require('./Guild');

module.exports = class Member extends User {
    constructor(client, guild, data) {
        this.#client = client;
        this.#rawData = data;
        this.guild = guild;
        if (data) this.loadData(data);
    }

    toUser() {
        if (this.#user)
            return this.#user;
        if (this.#rawData.user)
            return new User(this.#client, this.#rawData.user);
    }

    loadData(data) {
        if (data.user) {
            super.loadData(data.user);
            this.#user = new User(this.#client, data.user);
        }
        this.nick = data.nick;
        this.joinedAt = new Date(Date.parse(data.joinedAt));
        this.deafened = data.deaf;
        this.muted = data.mute;
        this.pending = data.pending; 
    }

    get displayName() {
        return this.nick || this.name
    }
}
