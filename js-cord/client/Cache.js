class ClientCache {
    constructor() {
        this.users = [];
        this.channels = [];
        this.guilds = [];
        this.messages = [];
    }
    addUser(item) {
        let buffer = this.getUser(item.id);
        if (buffer) this.users.splice(this.users.indexOf(buffer), 1);
        this.users.push(item);
        return item;
    }
    addChannel(item) {
        let buffer = this.getChannel(item.id);
        if (buffer) this.channels.splice(this.channels.indexOf(buffer), 1);
        this.channels.push(item);
        return item;
    }
    addGuild(item) {
        let buffer = this.getGuild(item.id);
        if (buffer) this.guilds.splice(this.guilds.indexOf(buffer), 1);
        this.guilds.push(item);
        return item;
    }
    addMessage(item) {
        let buffer = this.getMessage(item.channel.id, item.id);
        if (buffer) this.messages.splice(this.messages.indexOf(buffer), 1);
        this.messages.push(item);
        return item;
    }
    getUser(id) {
        let filtered = this.users.filter(item => item.id == id);
        if (filtered.length) return filtered[0];
        return undefined;
    }
    getChannel(id) {
        let filtered = this.channels.filter(item => item.id == id);
        if (filtered.length) return filtered[0];
        return undefined;
    }
    getGuild(id) {
        let filtered = this.guild.filter(item => item.id == id);
        if (filtered.length) return filtered[0];
        return undefined;
    }
    getMessage(channel_id, id) {
        let filtered = this.messages.filter(item => item.id == id && item.channel.id == channel_id);
        if (filtered.length) return filtered[0];
        return undefined;
    }
    clear(thing="all") {
        if (thing==="all") {
            this.users = [];
            this.channels = [];
            this.guilds = [];
            this.messages = [];
        } else if (['users', 'channels', 'guilds', 'messages']).includes(thing) {
            this[thing] = [];
        }
    }
}

class GuildCache {
    constructor() {
        this.members = [];
        this.roles = [];
        this.emojis = [];
    }
}

module.exports = { ClientCache, GuildCache }