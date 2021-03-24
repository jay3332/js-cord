FLAGS = {
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
    useVoiceActivity: 1n << 25n,
    changeNickname: 1n << 26n,
    manageNicknames: 1n << 27n,
    manageRoles: 1n << 28n,
    manageWebhooks: 1n << 29n,
    manageEmojis: 1n << 30n,
};

module.exports = class Permissions {
    constructor(value) {
        if (value & 8n) === 8n {
            this.value = 104324673n
        }
        this.value = value;
        for (let flag of Object.keys(FLAGS)) {
            this[flag] = !!((value & FLAGS[flag]) === FLAGS[flag]);
        }
    }
    get asArray() {
        let res = [];
        for (let flag of Object.keys(FLAGS)) {
            if (!!((this.value & FLAGS[flag]) === FLAGS[flag]))
                res.push(flag);
        }
        return res;
    }
    static all() {
        const value = Object.values(FLAGS).reduce((prev, after) => prev | after, 0n);
        return new Permissions(value);
    }
    static none() {
        return new Permissions(0);
    }
    static default() {
        return new Permissions(104324673n);
    }
}
