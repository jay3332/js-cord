const Bitfield = require('./Bitfield');


const MAPPING = {
    createInvites: 1n << 0n,
    kickMembers: 1n << 1n,
    banMembers: 1n << 2n,
    administrator: 1n << 3n,
    manageChannels: 1n << 4n,
    manageGuild: 1n << 5n,
    addReactions: 1n << 6n,
    viewAuditLog: 1n << 7n,
    prioritySpeaker: 1n << 8n,
    stream: 1n << 9n,
    viewChannel: 1n << 10n,
    sendMessages: 1n << 11n,
    sendTTSMessages: 1n << 12n,
    manageMessages: 1n << 13n,
    embedLinks: 1n << 14n,
    attachFiles: 1n << 15n,
    readMessageHistory: 1n << 16n,
    mentionEveryone: 1n << 17n,
    useExternalEmojis: 1n << 18n,
    viewGuildInsights: 1n << 19n,
    connect: 1n << 20n,
    speak: 1n << 21n,
    muteMembers: 1n << 22n,
    deafenMembers: 1n << 23n,
    moveMembers: 1n << 24n,
    useVoiceActivation: 1n << 25n,
    changeNickname: 1n << 26n,
    manageNicknames: 1n << 27n,
    manageRoles: 1n << 28n,
    manageWebhooks: 1n << 29n,
    manageEmojis: 1n << 30n, 
    useSlashCommands: 1n << 31n,
    requestToSpeak: 1n << 32n,
    // For whatever reason 1n << 33n is missing
    // Discord really likes skipping numbers
    manageThreads: 1n << 34n,
    usePublicThreads: 1n << 35n,
    usePrivateThreads: 1n << 36n 
}


module.exports = class Permissions extends Bitfield {
    constructor(value) {
        if (typeof value === 'object') {
            value = Permissions.fromObject(value).value;
        }
        super(value);
        this.__load(MAPPING);
    }

    static fromObject(object) {
        return super.fromObject(object, MAPPING);
    }

    overwrite(allow, deny) {
        this.value = (this.value & ~deny) | allow;
    }

    static all() {
        return new this(128849018879n);
    }

    static none() {
        return new this(0);
    }
}
