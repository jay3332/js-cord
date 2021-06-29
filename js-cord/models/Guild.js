const { ChannelType } = require('../enums');
const SlashCommand = require('../interactions/slash/SlashCommand');
const DiscordObject = require('./DiscordObject');
const GuildChannel = require('./GuildChannel');
const TextChannel = require('./TextChannel');
const Role = require('./Role');
const Member = require('./Member');
const Asset = require('./Asset');

/**
 * Represents a Discord server. 
 * In Discord's API, servers are referred to as "guilds".
 */
module.exports = class Guild extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        /**
         * The name of this guild.
         * @type {string}
         */
        this.name = data.name;
        
        /**
         * The default voice region of this guild.
         * @type {string}
         */
        this.region = data.region;

        /**
         * The asset that represents this guild's icon.
         * @type {Asset}
         */
        this.icon = new Asset(`icons/${data.id}`, data.icon);
        
        /**
         * The asset that represents this guild's splash image.
         * @type {Asset}
         */
        this.splash = new Asset(`splashes/${data.id}`, data.splash);

        /**
         * An array of members that are in the guild.
         * @type {Array<Member>}
         */
        this.members = [];

        /**
         * An array of the guild's channels.
         * @type {Array<Channel>}
         */
        this.channel = [];

        /**
         * An array of the guild's roles.
         * @type {Array<Role>}
         */
        this.roles = [];

        // TODO: Turn these into SnowflakeSet's
        
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

    /**
     * Fetches members from Discord and fills the cache.
     */
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

    /**
     * Gets a member by it's ID using the internal cache.
     * @param {string} id The ID of the member.
     * @returns {?Member} The found member, if any.
     */
    getMember(id) {
        return this.members.find(member => member.id == id);
    }

    /**
     * Gets a member by it's name using the internal cache.
     * @param {string} query The name or nickname of the member.
     * @param {object} options The options for querying.
     * @returns {?Member} The found member, if any.
     */
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

    /**
     * Gets a role by it's ID using the internal cache.
     * @param {string} id The ID of the role.
     * @returns {?Role} The found role, if any.
     */
    getRole(id) {
        return this.roles.find(role => role.id == id);
    }

    /**
     * Forces a request to Discord to get a member by their ID.
     * {@link #getMember} should be used instead, in order to cut down on requests.
     *  
     * @param {string} id The User ID of the member to fetch.
     * @returns {Promise<?Member>} The member fetched, if any. 
     */
    fetchMember(id) {
        return this.client.http.getMember(this.id, id).then(
            member => new Member(this.client, member)
        );
    }

    /**
     * Creates a role in this guild.
     * @param {?string} name The name of the role. 
     * @param {?object} options The options for the role. 
     * @returns {Promise<?Role>} The created role, if any.
    */
    createRole(name, options) {
        if (typeof name === 'object') {
            options = name;
            name = undefined
        }
        options = { name: name, ...options };
        return this.client.http.createRole(this.id, options);
    }

    /**
     * Creates a slash command in this guild.
     * @param {SlashCommand} command The command to create.
     * @param {?function} callback The temporary callback for when the command is invoked.
     * @returns {?SlashCommand} The created slash command, if successful.
     */
    async createSlashCommand(command, callback) {
        const payload = command.toJSON();
        const data = await this.client.http.createGuildSlashCommand(this.id, payload);
        command = SlashCommand.fromJSON(data);
        
        this.client.cache.commands.push(command);
        if (callback) this.client.onSlashCommand(command, callback);
        return command;
    }
}