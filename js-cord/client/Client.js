const { ConnectionError, InvalidEventError } = require('../errors/DiscordEventError');
const AllowedMentions = require("../structures/AllowedMentions");
const Intents = require("../structures/Intents");
const Requester = require('../http/Requester');
const ClientUser = require("../structures/ClientUser");
const Channel = require("../structures/Channel");
const User = require("../structures/User");
const Guild = require("../structures/Guild");
const { ClientCache } = require("../client/Cache");
const Slash = require("../client/Slash");

/**
 * Represents a client connection to Discord.
 */
class Client {
    constructor({ allowedMentions=AllowedMentions.default(), intents=Intents.default(), slash=false }={}) {
        //this.allowedMentions = (options.hasOwnProperty("allowedMentions")) ? options.allowedMentions : AllowedMentions.default();
        //this.intents = (options.hasOwnProperty("intents")) ? options.intents : Intents.default();

        this.allowedMentions = allowedMentions;
        this.intents = intents;

        this.isSlashClient = slash;
        this.cache = new ClientCache();
        this.token = null;
        this.loggedIn = false;
        this.isBotApplication = null;

        this.listeners = {};
        this.individualListeners = {}; // events, but they append

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
        return this.http.latencies[-1];
    }

    get averageLatency() {
        // Returns the average websocket latency for the past 20 heartbeats.
        const readings = this.http.latencies.slice(-20);
        const sum = readings.reduce((a, b) => a+b, 0);
        return sum / readings.length;
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
        id = id.toString();
        let res = this.cache.getUser(id);
        if (res) return res;
        return undefined;
    }
    getChannel(id) {
        id = id.toString();
        let res = this.cache.getChannel(id);
        if (res) return res;
        return undefined;
    }
    getGuild(id) {
        id = id.toString();
        let res = this.cache.getGuild(id);
        if (res) return res;
        return undefined;
    }
    getMessage(channel_id, id) {
        id = id.toString();
        channel_id = channel_id.toString();
        if (res) return res;
        return undefined;
    }

    /*
    getUser(userId) {
        userId = userId.toString();
        if (this.userCache.has(userId)) return this.userCache.get(userId);
        let user = new User(this, userId);
        this.userCache.set(userId, user);
        return user;
    }

    fetchUser(userId) {
        userId = userId.toString();
        let user = new User(this, userId);
        this.userCache.set(userId, user);
        return user;
    }

    getChannel(channelId) {
        channelId = channelId.toString();
        if (this.channelCache.has(channelId)) return this.channelCache.get(channelId);
        let channel = new Channel(this, channelId);
        this.channelCache.set(channelId, channel);
        return channel;
    }

    fetchChannel(channelId) {
        channelId = channelId.toString();
        let channel = new Channel(this, channelId);
        this.channelCache.set(channelId, channel);
        return channel;
    } 

    getGuild(guildId) {
        guildId = guildId.toString();
        if (this.guildCache.has(guildId)) return this.guildCache.get(guildId);
        let guild = new Guild(this, guildId);
        this.guildCache.set(guildId, guild);
        return guild;
    }

    fetchGuild(guildId) {
        guildId = guildId.toString();
        let guild = new Guild(this, guildId);
        this.guildCache.set(guildId, guild);
        return guild;
    }*/


    login(token, bot = true) {
        if (this.loggedIn)
            throw new ConnectionError("You're already logged in.");
        if (!token.match(/([^\W_]{24}\.[^\W_]{6}\.[\w\-]{27}|mfa\.[\w\-]{84})/))
            throw new ConnectionError("Invalid token.");
        this.token = token;    
        this.isBotApplication = token.startsWith("mfa") ? false : bot;
        this.http.putToken(token, bot);
        this.http.establishGateway();
    }

    logout() {
        if (!this.loggedIn)
            throw new ConnectionError("You weren't logged in.");
        this.http.logout();
        this.token = null;
        this.loggedIn = false;
        this.isBotApplication = false
    }

    listen(event, fn) {
        this.listeners[event] = fn;
    }

    addListener(event, fn) {
        if (!this.individualListeners[event]) {
            this.individualListeners[event] = [];
        }
        this.individualListeners[event].push(fn);
    }

    removeListener(event, fn) {
        if (!this.individualListeners[event]) {
            throw new InvalidEventError("Event not found.");
        } this.individualListeners[event] = this.individualListeners[event].filter(e => e!=fn);
        if (this.individualListeners[event].length) delete this.individualListeners[event];
    }

    clearListeners(event, fn) {
        this.individualListeners = {};
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
    }

    emit(event, parameters=[]) {
        try {
            if (!!this.individualListeners[event]) {
                if (this.individualListeners[event].length > 0) {
                    for (const individualListener of this.individualListeners[event]) {
                        individualListener(...parameters);
                    }
                }
            }

            if (this.constructor.name === "Bot") {
                const allCogsWithListeners = this.cogs.filter(cog => Object.keys(cog.listeners).length>0);
                for (const cog of allCogsWithListeners) {
                    if (cog.listeners.hasOwnProperty(event))
                        cog.listeners[event](...parameters);
                }
            }

            if (this.listeners.hasOwnProperty(event))
                this.listeners[event](...parameters);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
};

module.exports = Client;