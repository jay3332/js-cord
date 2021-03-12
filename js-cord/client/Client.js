const https = require('https'); 
const { ConnectionError, InvalidEventError } = require('../errors/DiscordEventError');
const Requester = require('../http/Requester');

class Client {
    constructor() {
        this.http = new Requester();
        this.token = null;
        this.loggedIn = false;
        this.isBotApplication = null;
        this.listeners = new Map();
        this.allEvents = [
            "ready",
            "message",
            "messageDelete",
            "messageEdit",
            "messageBulkDelete",
            "guildMemberAdd",
            "guildMemberRemove",
            "memberBan",
            "guildCreate",
            "guildDelete"
        ];
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