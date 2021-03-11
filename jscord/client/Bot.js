/**
 * Extension of Client, adds extra features such as command managers.
 * If you have a "message" listener, you must re-process your commands.
*/

const Client = require("./Client");
const { ConstructionError } = require("../errors/DiscordEventError");

/**
 * 
 */

class CommandContext {
	constructor(message, command, prefix, bot, arguments) {
		this.prefix = prefix;
		this.bot = bot;
		this.command = command;
		this.message = message;
		this.author = message.author;
		this.channel = message.channel;
		this.args = arguments;
	}
	invoke() {
		this.command.exec(this, ...arguments);
	}
};

function parseContext(message, bot) {
	const buffer = bot.prefixCaseInsensitive
		? message.content : message.content.toLowerCase();
	if (bot.prefix instanceof String) {
		if (!buffer.startsWith(bot.prefix)) return NaN;
	} else if (bot.prefix instanceof Array) {
		let temp = false;
		for (prefix of bot.prefix) {
			if (buffer.startsWith(prefix)) {
				temp = true;
			}
		}
		if (!temp) return NaN;
	} else {
		const prefix = bot.prefix();
		if (prefix instanceof String) {
		if (!buffer.startsWith(prefix)) return NaN;
	} else if (prefix instanceof Array) {
		let temp = false;
		for (prf of prefix) {
			if (buffer.startsWith(prf)) {
				temp = true;
			}
		}
		if (!temp) return NaN;
	} 
	}
}

class Cooldown {
	/**
	 * Represents a command cooldown.
	 */
	constructor(rate, cooldown, type = "user") {
		self.rate = rate;
		self.cooldown = cooldown;
		self.type = type;
	}
}

class Command {
	constructor(name, aliases, description, cooldown = Cooldown(1, 0), exec = ()=>{return}) {
		this.name = name;
		this.aliases = aliases;
		this.description = description;
		this.defaultCooldown = cooldown;
		this.exec = exec; 
	}
	setCooldown(newCooldown) {
		if (!newCooldown instanceof Cooldown)
			throw Error('Your cooldown must be a discord.Cooldown object.')
		this.defaultCooldown = newCooldown;
	}
	get execParams () {
		const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		const ARGUMENT_NAMES = /([^\s,]+)/g;

  		let fnStr = this.exec.toString().replace(STRIP_COMMENTS, '');
  		let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  		if(result === null) result = [];
		return result;
	}
	get signature() {
		/** 
		 * Returns the signature / usage of the command, e.g.
		 * <argument> [optional] [text...]
		 */
		const parameters = this.execParams();

	}
}

class Bot extends Client {
	constructor(obj) {
		this.prefix = "";
		this.prefixCaseInsensitive = false;
		this.commandsCaseInsensitive = false;
		this.commandCooldowns = new Map();
		if (
			obj instanceof String ||
			obj instanceof Array  ||
			obj instanceof Function
		) {
			this.prefix = obj;
		} else if (obj instanceof Object) {
			if (obj.hasOwnProperty("prefix")) this.prefix = obj.prefix;
			if (obj.hasOwnProperty("prefixCaseInsensitive")) this.prefixCaseInsensitive = obj.prefixCaseInsensitive;
			if (obj.hasOwnProperty("commandsCaseInsensitive")) this.commandsCaseInsensitive = obj.commandsCaseInsensitive;
		} else throw new ConstructionError("Bot constructor takes in a string, function, or object, nothing else.");
		if (this.prefixCaseInsensitive) {
			if (!(this.prefix instanceof Array || this.prefix instanceof Function)) {
				this.prefix = this.prefix.toLowerCase();
			} else if (this.prefix instanceof Array) {
				this.prefix = this.prefix.map(p => p.toLowerCase());
			}
		}
		super().listeners.set("message", message => {
			const context = parseContext(message, this);
			if (isNaN(context)) return;
			context.invoke();
		});
	}

}