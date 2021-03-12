const https = require('https'); 
const { ConnectionError, InvalidEventError } = require('../errors/DiscordEventError');
const Requester = require('../http/Requester');
const ClientUser = require("../structures/ClientUser");
const Messageable = require("../structures/Messageable");
const User = require("../structures/User");

class Client {
    constructor() {
        this.http = new Requester();
        this.token = null;
        this.loggedIn = false;
        this.isBotApplication = null;
        this.listeners = new Map();
        this.userCache = new Map();
        this.channelCache = new Map();
        this.allEvents = [
            "ready",
            "reconnect",
            "message",
            "messageDelete",
            "messageEdit",
            "messageBulkDelete",
            "memberJoin",
            "memberEdit",
            "memberRemove",
            "memberBan",
            "memberUnban",
            "guildJoin",
            "guildEdit",
            "guildRemove",
            "channelCreate",
            "channelEdit",
            "channelDelete",
            "channelPinsUpdate",
            "roleCreate",
            "roleDelete",
            "roleEdit",
            "inviteCreate",
            "inviteDelete",
            "reactionAdd",
            "reactionRemove",
            "reactionClear",
            "reactionDelete",
            "userStatusChange",
            "typing",
            "userEdit",
            "voiceStateEdit",
            "voiceServerEdit",
            "webhookEdit",
            "slashCommandCreate",
            "slashCommandEdit",
            "slashCommandDelete",
            "slashCommandUsed"
        ];

        this.user = null;
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
        let channel = new Messageable(this, channelId);
        this.channelCache.set(channelId, channel);
        return channel;
    }

    fetchChannel(channelId) {
        channelId = channelId.toString();
        let channel = new Messageable(this, channelId);
        this.channelCache.set(channelId, channel);
        return channel;
    } 


    login(token, bot = true) {
        if (this.loggedIn)
            throw new ConnectionError("You're already logged in.");
        if (!token.match(/([^\W_]{24}\.[^\W_]{6}\.[\w\-]{27}|mfa\.[\w\-]{84})/))
            throw new ConnectionError("Invalid token.");
        this.token = token;
        this.loggedIn = true;
        this.isBotApplication = token.startsWith("mfa") ? false : bot;
        this.http.putToken(token, bot);
        this.user = new ClientUser(this);
        this.emit("ready", []);
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
        if (!this.allEvents.includes(event))
            throw new InvalidEventError(`${event} is not a valid event.`);
        this.listeners.set(event, fn);
    }

    emit(event, parameters) {
        if (this.listeners.has(event)) {
            try {
                this.listeners.get(event)(...parameters);
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        }
        else return false;
    }
};

module.exports = Client