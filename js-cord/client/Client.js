const https = require('https'); 
const { ConnectionError, InvalidEventError } = require('../errors/DiscordEventError');
const AllowedMentions = require("../structures/AllowedMentions");
const Intents = require("../structures/Intents");
const Requester = require('../http/Requester');
const ClientUser = require("../structures/ClientUser");
const Channel = require("../structures/Channel");
const User = require("../structures/User");
const Guild = require("../structures/Guild");

class Client {
    constructor(options={}) {
        this.allowedMentions = (options.hasOwnProperty("allowedMentions")) ? options.allowedMentions : AllowedMentions.default();
        this.intents = (options.hasOwnProperty("intents")) ? options.intents : Intents.default();

        this.token = null;
        this.loggedIn = false;
        this.isBotApplication = null;

        this.listeners = {};
        this.individualListeners = {}; // events, but they append

        this.userCache = new Map();
        this.channelCache = new Map();
        this.guildCache = new Map();

        this.allEvents = [
            "ready", "reconnect", "resumed",
            "message", "messageDelete", "messageEdit",
            "messageBulkDelete", "memberJoin", "memberEdit",
            "memberRemove", "memberBan", "memberUnban",
            "guildJoin", "guildEdit", "guildRemove",
            "channelCreate", "channelEdit", "channelDelete",
            "channelPinsUpdate", "roleCreate", "roleDelete",
            "roleEdit", "inviteCreate", "inviteDelete",
            "reactionAdd", "reactionRemove", "reactionClear",
            "reactionDelete", "userStatusChange", "typing",
            "userEdit", "voiceStateEdit", "voiceServerEdit",
            "webhookEdit", "slashCommandCreate", "slashCommandEdit",
            "slashCommandDelete", "slashCommandUsed"
        ];

        this.http = new Requester(this);
    }

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
    }


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