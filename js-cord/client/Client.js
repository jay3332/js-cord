const { ConnectionError, InvalidEventError } = require('../errors/DiscordEventError');
const AllowedMentions = require("../structures/AllowedMentions");
const Intents = require("../structures/Intents");
const Requester = require('../http/Requester');
const ClientUser = require("../structures/ClientUser");
const Channel = require("../structures/Channel");
const User = require("../structures/User");
const Guild = require("../structures/Guild");
const { ClientCache } = require("../client/Cache");
const Slash = require("../slash/Slash");
const Application = require("../structures/Application");

/**
 * Represents a client connection to Discord.
 */
class Client {
    constructor({ allowedMentions=AllowedMentions.default(), intents=Intents.default(), slash=false, debug=false }={}) {
        //this.allowedMentions = (options.hasOwnProperty("allowedMentions")) ? options.allowedMentions : AllowedMentions.default();
        //this.intents = (options.hasOwnProperty("intents")) ? options.intents : Intents.default();

        this.allowedMentions = allowedMentions;
        this.intents = intents;

        this.debug = debug;
        this.isSlashClient = slash;
        this.cache = new ClientCache();
        this.token = null;
        this.loggedIn = false;
        this.isBotApplication = null;

        this.listeners = {};
        this.individualListeners = {}; // events, but they append
        this.upSince = null;

        this.allEvents = [
            "ready", "reconnect", "resumed",
            "message", "messageDelete", "messageEdit",
            "rawMessageEdit", "rawMessageDelete", "rawMessageBulkDelete",
            "messageBulkDelete", "memberJoin", "memberEdit",
            "memberRemove", "memberBan", "memberUnban",
            "guildJoin", "guildEdit", "guildRemove", "guildAvailable",
            "channelCreate", "channelEdit", "channelDelete",
            "channelPinsUpdate", "roleCreate", "roleDelete",
            "roleEdit", "inviteCreate", "inviteDelete",
            "reactionAdd", "reactionRemove", "reactionClear",
            "reactionDelete", "userStatusChange", "typing",
            "userEdit", "voiceStateEdit", "voiceServerEdit",
            "webhookEdit",
        ];
        if (this.isSlashClient) this.allEvents.push(
            "slashCommandCreate", "slashCommandEdit",
            "slashCommandDelete", "slashCommandUsed"
        );

        this.http = new Requester(this);
    }

    get latency() {
        // Returns the average websocket latency for the past 5 heartbeats.
        const readings = this.http.latencies.slice(-5);
        const sum = readings.reduce((a, b) => a+b, 0);
        return sum / readings.length;
    }

    get currentLatency() {
        // Returns the most recent websocket latency reading.
        return this.http.latencies.slice(-1)[0];
    }

    get averageLatency() {
        // Returns the average websocket latency for the past 20 heartbeats.
        const readings = this.http.latencies.slice(-20);
        const sum = readings.reduce((a, b) => a+b, 0);
        return sum / readings.length;
    }

    get uptime() {
        if (!this.upSince) return 0;
        const current = parseFloat(process.hrtime().join("."));
        return current - this.upSince;
    }

    get slash() {
        if (!this.isSlashClient) throw new TypeError(
            "A normal client cannot create or modify slash commands. "+
            "You can create a Slash client by setting the 'slash' option to true. "+
            "(example: const client = new discord.Client({ slash: true }))"
        )
        if (!this._slash) this._slash = new Slash(this);
        return this._slash;
    }

    get users() {
        return this.cache.users;
    }
    get guilds() {
        return this.cache.guilds;
    }
    get channels() {
        return this.cache.channels;
    }
    get messages() {
        return this.cache.messages;
    }

    getUser(id) {
        let res = this.cache.getUser(id);
        if (res) return res;
        return undefined;
    }
    getChannel(id) {
        let res = this.cache.getChannel(id);
        if (res) return res;
        return undefined;
    }
    getGuild(id) {
        let res = this.cache.getGuild(id);
        if (res) return res;
        return undefined;
    }
    getMessage(channel_id, id) {
        let res = this.cache.getMessage(channel, id);
        if (res) return res;
        return undefined;
    }

    async login(token, bot = true) {
        if (this.loggedIn)
            throw new ConnectionError("You're already logged in.");
        this.token = token;
        this.isBotApplication = token.startsWith("mfa.") ? false : bot;
        this.http.putToken(token, bot);
        await this.http.establishGateway();
        await this._getApplication();
        return this;
    }

    async _getApplication() {
        const response = await this.http.getApplicationInfo();
        if (response) {
            this.id = response.id;
            this.application = new Application(this, response);
            this.ownerID = this.application.ownerID;
            this.ownerIDs = this.application.ownerIDs || [this.ownerID];
        }
    }

    async logout() {
        if (!this.loggedIn)
            throw new ConnectionError("You weren't logged in.");
        await this.http.logout();
        this.token = null;
        this.loggedIn = false;
        this.isBotApplication = false;
        return this;
    }

    async createGuild(name, options) {
        if (typeof name === "object") {
            options = name;
            name = options.name
        }
        if (!name)
            throw new Error("Name is a required argument that is missing.");
        if (options.roles)
            options.roles = options.roles.map(role => role.json);
        if (options.channels)
            options.channels = options.channels.map(role => channel.json);
        if (options.icon)
            {}
        const response = await this.http.createGuild(name, options.icon, options.roles, options.channels);
        return new Guild(this, response);
    }

    async deleteGuild(guild) {
        if (guild instanceof Guild) {
            guild = guild.id;
        }
        const response = await this.http.deleteGuild(guild);
        return response;
    }

    listen(event, fn) {
        this.listeners[event] = fn;
        return this;
    }

    addListener(event, fn) {
        if (!this.individualListeners[event]) {
            this.individualListeners[event] = [];
        }
        this.individualListeners[event].push(fn);
        return this;
    }

    removeListener(event, fn) {
        if (!this.individualListeners[event]) {
            throw new InvalidEventError("Event not found.");
        } this.individualListeners[event] = this.individualListeners[event].filter(e => e!=fn);
        if (this.individualListeners[event].length) delete this.individualListeners[event];
        return this;
    }

    clearListeners(event, fn) {
        this.individualListeners = {};
        return this;
    }

    waitFor(event, check=null, { timeout=0 }={}) {
        let finished = false;
        const fn = (...args) => {
            if (!!check) {
                if (!check(...args)) return;
            }
            finished = true;
            this.removeListener(event, fn);
        }
        this.addListener(event, fn);
        const start = Date.now();
        while ((() => {
            if (finished) return false;
            if (timeout>0) {if (Date.now()-start > timeout)
                                return false;}

        })()) {}
        if (!finished) throw new /*WaitForTimeout*/Error("Timeout reached");
        return this;
    }

    async emit(event, parameters=[]) {
        try {
            if (!!this.individualListeners[event]) {
                if (this.individualListeners[event].length > 0) {
                    for (const individualListener of this.individualListeners[event]) {
                        await individualListener(...parameters);
                    }
                }
            }

            if (this.constructor.name === "Bot") {
                const allCogsWithListeners = this.cogs.filter(cog => Object.keys(cog.listeners).length>0);
                for (const cog of allCogsWithListeners) {
                    if (cog.listeners.hasOwnProperty(event))
                        await cog.listeners[event](...parameters);
                }
            }

            if (this.listeners.hasOwnProperty(event))
                await this.listeners[event](...parameters);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
};

module.exports = Client;
