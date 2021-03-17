class ClientCache {
    constructor() {
        this.users = [];
        this.channels = [];
        this.guilds = [];
        this.messages = [];
    }
    addUser(item) {
        this.removeUser(item.id);
        this.users.push(item);
        return item;
    }
    addChannel(item) {
        this.removeChannel(item.id);
        this.channels.push(item);
        return item;
    }
    addGuild(item) {
        this.removeGuild(item.id)
        this.guilds.push(item);
        return item;
    }
    addMessage(item) {
        this.removeMessage(item.channel.id, item.id);
        this.messages.push(item);
        return item;
    }
    removeUser(id) {
        let buffer = this.getUser(id);
        if (buffer) this.users.splice(this.users.indexOf(buffer), 1);
        return buffer;
    }
    removeChannel(id) {
        let buffer = this.getChannel(id);
        if (buffer) this.channels.splice(this.channels.indexOf(buffer), 1);
        return buffer;
    }
    removeGuild(id) {
        let buffer = this.getGuild(id);
        if (buffer) this.guilds.splice(this.guilds.indexOf(buffer), 1);
        return buffer;
    }
    removeMessage(channel_id, id) {
        let buffer = this.getMessage(channel_id, id);
        if (buffer) this.messages.splice(this.messages.indexOf(buffer), 1);
        return buffer;
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
        } else if (['users', 'channels', 'guilds', 'messages'].includes(thing)) {
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