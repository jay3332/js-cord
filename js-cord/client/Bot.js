/**
 * Extension of Client, adds extra features such as command managers.
 * If you have a "message" listener, you must re-process your commands.
*/

const Client = require("./Client");
const { ConstructionError } = require("../errors/DiscordEventError");
const Check = require('../commands/Check'),
	Command = require('../commands/Command'),
	CommandContext = require('../commands/CommandContext'),
	Cooldown = require('../commands/Cooldown');

class Bot extends Client {
    constructor(obj) {
        let buffer = {};
        for (const prop of ["allowedMentions", "intents"]) {
            if (obj.hasOwnProperty(prop)) {
                buffer[prop] = obj[prop];
            }
        }
        super(buffer);

        this.allEvents.push(
            "command",
            "commandError",
            "commandComplete"
        );

        this.prefix = "";
        this.prefixCaseInsensitive = false;
        this.commandsCaseInsensitive = false;
        this.guildOnly = false;

        this.commands = [];
        this.commandCooldowns = {};
        this.cogs = [];

        if (["string", "function", "array"].includes(typeof obj)) {
            this.prefix = obj;
        } else if (typeof obj == "object") {
            if (obj.hasOwnProperty("prefix")) this.prefix = obj.prefix;
            if (obj.hasOwnProperty("prefixCaseInsensitive")) this.prefixCaseInsensitive = obj.prefixCaseInsensitive;
            if (obj.hasOwnProperty("commandsCaseInsensitive")) this.commandsCaseInsensitive = obj.commandsCaseInsensitive;
            if (obj.hasOwnProperty("guildOnly")) this.guildOnly = obj.guildOnly;
        } else throw new ConstructionError("Bot constructor takes in a string, function, or object, nothing else.");
        if (this.prefixCaseInsensitive) {
            if (!(this.prefix instanceof Array || this.prefix instanceof Function)) {
                this.prefix = this.prefix.toLowerCase();
            } else if (this.prefix instanceof Array) {
                this.prefix = this.prefix.map(p => p.toLowerCase());
            }
        }
        this.listeners["message"] = message => {
            this.processCommands(message);
        };
        this.listeners["commandError"] = (ctx, error) => {
            throw error;
        }
    }
    command(options, exec) {
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const ARGUMENT_NAMES = /([^\s,]+)/g;

        let fnStr = exec.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if(result === null) result = [];

        if (!result.length) throw new Error("Command execution function requires a context parameter.")

        if (typeof options === "string") {
            options = {name: options}
        } if (typeof options !== "object") {
            throw new Error("Command settings must be a string or object.")
        } if (!options.hasOwnProperty('name')) {
            throw new Error("\"name\" is a required object parameter.")
        } 

        const name = options.name;
        let aliases = [];
        if (options.hasOwnProperty('aliases')) aliases = options.aliases;
        if (options.hasOwnProperty('alias'))   aliases = [options.alias];
        if (!aliases instanceof Array) {
            throw new Error("Aliases must be an Array.")
        }
        const nameAndAliases = [name, ...aliases];
        const allCommandNames = this.commands.map(command => [command.name, ...command.aliases]);
        for (cmd of allCommandNames) {
            for (a of nameAndAliases) {
                if (cmd.includes(a)) {
                    throw new Error(`Command name/aliases ${a} already used.`)
                }
            }
        }
        
        let checks = [];
        let cooldown = Cooldown.none();
        let guildOnly = this.guildOnly;
        let permissions = null;
        let cog = null;

        if (options.hasOwnProperty('check')) checks = [options.check];
        if (options.hasOwnProperty('checks')) checks = options.checks;
        if (options.hasOwnProperty('cooldown')) cooldown = options.cooldown;
        if (options.hasOwnProperty('guildOnly')) guildOnly = options.guildOnly;
        if (options.hasOwnProperty('permissions')) guildOnly = options.permissions;
        if (options.hasOwnProperty('cog')) cog = options.cog;

        // delete default options
        for (let option of Object.keys(options)) {
            if (["name", "alias", "aliases", "check", "checks", "cooldown", "guildOnly", "permissions", "cog"].includes(option)) {
                delete options[option];
            } 
        }

        this.commands.push(new Command(name, aliases, checks, cooldown, guildOnly, permissions, exec, options, cog));
    }
    getCommand(name) {
        if (this.commandsCaseInsensitive) name = name.toLowerCase();
        for (let command of this.commands) {
            nameAndAliases = [command.name, ...command.aliases];
            if (nameAndAliases.contains(name)) return command;
        } return null;
    }
    getPrefix(message) {
        let content = message.content;
        if (this.prefixCaseInsensitive) content = content.toLowerCase();
        let prefix = this.prefix;
        if (typeof this.prefix == "function") {
            prefix = this.prefix(this, message);
        }
        if (typeof prefix == "string") {
            return content.startsWith(prefix) ? prefix : null;
        } else if (this.prefix instanceof Array) {
            for (prf of prefix) {
                if (content.startsWith(prf)) {
                    return prf;
                }
            }
            return null;
        } 
        return null;
    }
    processCommands(message) {
        const context = CommandContext.parseContext(message, this);
        if (!context) return;
        if (context.author.bot) return;
        context.invoke();
    }
}

module.exports = Bot;