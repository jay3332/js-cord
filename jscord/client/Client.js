const https = require('https'); 
const { ConnectionError, InvalidEventError } = require('../errors/DiscordEventError');

const url = 'https://discord.com/api/v8';

class Connection {
	/* Manages HTTP requests with Discord. */
	constructor(token) {
		this.token = token;
		this.information = https.request({
			hostname: url,
			path: "/oauth2/applications/@me",
			method: "GET"
		}, response => {
			if (response.statusCode !== 200)
				throw new ConnectionError(`Connection failed with status code ${response.statusCode}`);
		});
	}

};

class Messageable {
	
}

class Client {
	constructor() {
		this.http = null;
		this.token = null;
		this.loggedIn = false;
		this.isBotApplication = null;
		this.listeners = new Map();
	}

	login(token, bot = true) {
		if (this.loggedIn)
			throw new ConnectionError("You're already logged in.");
		if (!token.match(/([^\W_]{24}\.[^\W_]{6}\.[\w\-]{27}|mfa\.[\w\-]{84})/))
			throw new ConnectionError("Invalid token.");
		this.token = token;
		this.loggedIn = true;
        this.isBotApplication = token.startsWith("mfa") ? false : bot;
		this.http = new Connection(this.token);
		this.emit("ready", []);
	}

	logout() {
		if (!this.loggedIn)
			throw new ConnectionError("You weren't logged in.");
		this.http = null;
		this.token = null;
		this.loggedIn = false;
		this.isBotApplication = false
	}

	listen(event, fn) {
		const allEvents = [
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
		if (!allEvents.includes(event))
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