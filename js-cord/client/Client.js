const { sum } = require('../utils');
const { InvalidToken } = require('../errors/Errors');
const Intents = require('../models/Intents');
const SlashCommand = require('../interactions/slash/SlashCommand');
const SnowflakeSet = require('../models/SnowflakeSet');
const HTTPClient = require('../core/HTTPClient');
const Websocket = require('../core/Websocket');
const Emitter = require('./Emitter');
const Guild = require('../models/Guild');

/**
 * Represents a client connection to the Discord API and Gateway.
 * @param {object?} options The options to use for the client. 
 */
module.exports = class Client extends Emitter {
    #apiVersion;
    #gatewayVersion;

    constructor({ 
        allowedMentions,
        intents = Intents.default(), 
        apiVersion = 9,
        gatewayVersion = 9 } = {}
    ) {
        super();

        /**
         * Represents the internal cache of the client.
         */
        this.cache = {
            guilds: new SnowflakeSet(),
            channels: new SnowflakeSet(),
            users: new SnowflakeSet(),
            messages: new SnowflakeSet(),
            emojis: new SnowflakeSet(),
            roles: new SnowflakeSet(),
            commands: new SnowflakeSet()
        }

        this._slash = [];
        this._components = [];
        this._dropdownOpts = [];

        /**
         * The default allowed mentions to use whenever the client sends a message.
         */
        this.allowedMentions = allowedMentions;
        
        /**
         * The intents to use when connecting to the gateway.
         */
        this.intents = intents;

        /**
         * Whether or not the client has made at least one heartbeat with the websocket yet.
         */
        this.loggedIn = false;

        this.logger = { log: (..._) => {} };

        /**
         * The HTTPClient the client uses to make HTTP requests.
         */
        this.http = undefined;

        /**
         * The websocket the client uses to interact with the gateway.
         */
        this.ws = undefined;

        /**
         * The client's {@link ClientUser} object. 
         */
        this.user = undefined;

        this.#apiVersion = apiVersion;
        this.#gatewayVersion = gatewayVersion;
    }

    /**
     * Returns this client's User ID.
     */
    get id() {
        return this.user?.id;
    }

    /**
     * Gets the requested API version the client will use.
     */
    get apiVersion() {
        return this.#apiVersion;
    }

    /**
     * Gets the requested gateway version the client will use.
     */
    get gatewayVersion() {
        return this.#gatewayVersion;
    }

    /**
     * Returns the bot's latency in milliseconds.
     */
    get latency() {
        let latencies = this.ws.latencies;
        let lastThree = latencies.slice(-3);
        return (sum(lastThree) / lastThree.length) * 1000
    }

    #putToken(token) {
        if (!token) throw new InvalidToken('Token is undefined.');
        this.token = token;
    }

    #establishHTTP() {
        this.http = new HTTPClient(this, this.apiVersion);
    }

    #establishWebsocket() {
        this.ws = new Websocket(this, this.gatewayVersion);
    }

    /**
     * Starts the bot.
     * @async
     * @param {string} token The token to use to login into the gateway.
     */
    async start(token) {
        this.#putToken(token);
        this.#establishHTTP();
        this.#establishWebsocket();
        await this.ws.start();
    }

    /**
     * Logs into Discord and starts the bot.
     * @param {string} token The authentication token given by Discord.
     */
    login(token) {
        this.start(token).then();
    }

    /**
     * Tries to get a user from the internal cache.
     * @param {string} id The id of the user to find.
     * @returns {?User} The found user.
     */
    getUser(id) {
        return this.cache.users.get(id);
    }

    /**
     * Tries to get a channel from the internal cache.
     * @param {string} id The id of the guild to find.
     * @returns {?Guild} The found guild.
     */
    getGuild(id) {
        return this.cache.guilds.get(id);
    }

    /**
     * Tries to get a channel from the internal cache.
     * @param {string} id The id of the channel to find.
     * @returns {?Channel} The found channel.
     */
    getChannel(id) {
        return this.cache.channels.get(id);
    }

    /**
     * Tries to get a role from the internal cache.
     * @param {string} id The id of the role to find.
     * @returns {?Role} The found role.
     */
    getRole(id) {
        return this.cache.roles.get(id);
    }

    /**
     * Gets all of the users currently stored in the internal cache.
     */
    get users() {
        return [...this.cache.users.values()];
    }

    /**
     * Gets all of the channels currently stored in the internal cache.
     */
    get channels() {
        return [...this.cache.channels.values()];
    }

    /**
     * Gets all of the guilds currently stored in the internal cache.
     */
    get guilds() {
        return [...this.cache.guilds.values()];
    }

    /**
     * Gets all of the roles currently stored in the internal cache.
     */
    get roles() {
        return [...this.cache.roles.values()];
    }

    /**
     * Fetches a guild via ID from the Discord API.
     * @param {string} id The ID of the guild to fetch.
     * @returns {Guild} The guild object. 
     */
    async fetchGuild(id) {
        const data = await this.http.getGuild(id);
        const guild = new Guild(this, data);
        this.cache.guilds.push(guild);
        return guild;
    }

    /**
     * Creates a guild.
     * @param {string} name The name of the guild.
     * @returns {Guild} The guild created.
     */
    async createGuild(name) {
        const data = await this.http.createGuild(name);
        const guild = new Guild(this, data);
        this.cache.guilds.push(guild);
        return guild;
    }

    /**
     * Listens for when a slash command is invoked.
     * 
     * Callback can take zero, one `(ctx: SlashContext)` parameter, 
     * or two `(ctx: SlashContext, options: Object)` parameters.
     * 
     * You must supply a slash command or it's ID in this case.
     * You can query slash commands by it's name via `Client#getSlashCommandNamed`.
     * 
     * @param {SlashCommand | string} command The slash command or it's ID to listen for. 
     * @param {function} callback The callback of the command.
     */
    onSlashCommand(command, callback) {
        if (typeof command === 'string') {
            command = { id: command };
        }
        const id = command.id;
        this._slash.push({ id: id, callback: callback });
    }

    /**
     * Creates a global slash command.
     * You can also create guild slash commands here, too.
     * 
     * @see {@link Client#onSlashCommand}
     * @param {SlashCommand} command The slash command to create.
     * @param {?Guild | string | Array<Guild | string>} guilds 
     * The guild or array of guilds that this slash command will be created in. Leave blank for global.
     * @param {?function} callback The callback for when this command is invoked. 
     * @returns {SlashCommand} The slash command created. 
     */
    async createSlashCommand(command, guilds, callback) {
        if (typeof guilds === 'function') {
            callback = guilds;
            guilds = undefined;
        }
        guilds = guilds || [];
        if (!(guilds instanceof Array))
            guilds = [ guilds ];

        const payload = command.toJSON();
        if (!guilds.length) {
            const data = await this.http.createGlobalSlashCommand(payload);
            command = SlashCommand.fromJSON(data);
            
            this.cache.commands.push(command);
            if (callback) this.onSlashCommand(command, callback);
            return command;
        } else {
            let data, commands = [];
            for (let guild of guilds) {
                const id = guild instanceof Guild
                    ? guild.id : guild;
                
                data = await this.http.createGuildSlashCommand(id, payload);
                command = SlashCommand.froomJSON(data);
                if (callback) this.onSlashCommand(command, callback);
                commands.push(command);
            }
            return commands[0];
        }
    }
}
