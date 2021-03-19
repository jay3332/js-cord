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
        let filtered = this.users.find(item => item.id === id);
        if (filtered) return filtered;
        return undefined;
    }
    getChannel(id) {
        let filtered = this.channels.find(item => item.id === id);
        if (filtered) return filtered;
        return undefined;
    }
    getGuild(id) {
        let filtered = this.guilds.find(item => item.id === id);
        if (filtered) return filtered;
        return undefined;
    }
    getMessage(channel_id, id) {
        let filtered = this.messages.find(item => item.id === id && item.channel.id === channel_id);
        if (filtered) return filtered;
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
    addMember(item) {
        this.removeMember(item.id);
        this.members.push(item);
        return item;
    }
    addRole(item) {
        this.removeRole(item.id);
        this.roles.push(item);
        return item;
    }
    addEmoji(item) {
        this.removeEmoji(item.id);
        this.emojis.push(item);
        return item;
    }
    removeMember(id) {
        let buffer = this.getMember(id);
        if (buffer) this.members.splice(this.members.indexOf(buffer), 1);
        return buffer;
    }
    removeRole(id) {
        let buffer = this.getRole(id);
        if (buffer) this.roles.splice(this.roles.indexOf(buffer), 1);
        return buffer;
    }
    removeEmoji(id) {
        let buffer = this.getEmoji(id);
        if (buffer) this.emojis.splice(this.emojis.indexOf(buffer), 1);
        return buffer;
    }
    getMember(id) {
        let filtered = this.members.find(item => item.id === id);
        if (filtered) return filtered;
        return undefined
    }
    getRole(id) {
        let filtered = this.roles.find(item => item.id === id);
        if (filtered) return filtered;
        return undefined
    }
    getEmoji(id) {
        let filtered = this.emojis.find(item => item.id === id);
        if (filtered) return filtered;
        return undefined
    }
}

module.exports = { ClientCache, GuildCache }