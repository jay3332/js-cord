const Bitfield = require('./Bitfield');

const MAPPING = {
    guilds: 1 << 0,
    members: 1 << 1,
    bans: 1 << 2,
    emojis: 1 << 3,
    integrations: 1 << 4,
    webhooks: 1 << 5,
    invites: 1 << 6,
    voice: 1 << 7,
    presences: 1 << 8,
    guildMessages: 1 << 9,
    guildReactions: 1 << 10,
    guildTyping: 1 << 11,
    dmMessages: 1 << 12,
    dmReactions: 1 << 13,
    dmTyping: 1 << 14,
    messages: 1 << 9 | 1 << 12,
    reactions: 1 << 10 | 1 << 13,
    typing: 1 << 11 | 1 << 14
}


module.exports = class Intents extends Bitfield {
    constructor(value) {
        if (typeof value === 'object') {
            value = Intents.fromObject(value).value;
        }
        super(value);
        this.__load(MAPPING);
    }

    static fromObject(object) {
        return super.fromObject(object, MAPPING);
    }

    static all() {
        return new this(32767);
    }

    static none() {
        return new this(0);
    }

    static default() {
        const intents = this.all();
        intents.members = false;
        intents.presences = false;
        return intents;
    }
}
