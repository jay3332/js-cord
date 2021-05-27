const { ChannelType } = require('../enums');
const DiscordObject = require('./DiscordObject');
const GuildChannel = require('./GuildChannel');
const TextChannel = require('./TextChannel');
const Role = require('./Role');
const Member = require('./Member');
const Asset = require('./Asset');

module.exports = class Guild extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        this.name = data.name;
        this.region = data.region;
        this.icon = new Asset(`icons/${data.id}`, data.icon);
        this.splash = new Asset(`splashes/${data.id}`, data.splash);
        
        if (data.members) this.members = data.members.map(member => {
            if (!member) return;

            let obj = new Member(this.client, this, member);
            let user = obj.toUser();

            if (obj.id === this.client.id) this.me = obj; 
            if (user) this.client.cache.users.push(user);
            return obj;
        })
            .filter(member => member);

        if (data.channels) this.channels = data.channels.map(channel => {
            if (!channel) return;

            if ([ChannelType.text, ChannelType.news].includes(channel.type)) {
                channel = new TextChannel(this.client, channel); 
            }  else {
                channel = new GuildChannel(this.client, channel);
            }

            this.client.cache.channels.push(channel);
            return channel;
        })
            .filter(channel => channel);

        if (data.roles) this.roles = data.roles.map(role => {
            if (!role) return;

            let obj = new Role(this.client, this, role);
            this.client.cache.roles.push(obj);
            return obj;
        })
            .filter(role => role);

        if (data.me && !this.me)
            this.me = new Member(this.client, data.me); 
    }

    async fillMembers() {
        const http = this.client.http;
        const data = await http.getMembers(this.id);

        this.members = data.map(member => {
            if (!member) return;

            let obj = new Member(this.client, this, member);
            let user = obj.toUser();

            if (obj.id === this.client.id) this.me = obj; 
            if (user) this.client.cache.users.push(user);
            return obj;
        })
            .filter(member => member);
    }

    getMember(id) {
        return this.members.find(member => member.id == id);
    }

    getMemberNamed(query, { caseInsensitive = false } = {}) {
        // If a discriminator was provided, use it too
        const _ = caseInsensitive 
            ? (text => text.toLowerCase())
            : (text => text);

        query = _(query);
        if (query.match(/^.{2,32}#[0-9]{4}$/gs)) {
            return this.members.find(member => _(member.tag) === query);
        }
        return this.members.find(member => _(member.name) === query || _(member.nick) === query);
    }

    getRole(id) {
        return this.roles.find(role => role.id == id);
    }
}