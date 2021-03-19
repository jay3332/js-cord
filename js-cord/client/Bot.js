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
    constructor({ prefix, prefixCaseInsensitive=false, commandsCaseInsensitive=false, guildOnly=false, 
                  allowedMentions, intents, slash }) {
        
        super({ allowedMentions: allowedMentions, intents: intents });

        this.allEvents.push(
            "command",
            "commandError",
            "commandComplete"
        );

        this.prefix = prefix;
        this.prefixCaseInsensitive = prefixCaseInsensitive;
        this.commandsCaseInsensitive = commandsCaseInsensitive;
        this.guildOnly = guildOnly;

        this.commands = [];
        this.commandCooldowns = {};
        this.cogs = [];

        if (!["string", "function", "array"].includes(typeof prefix)) {
            throw new ConstructionError("Prefix must be a String, Function, or Array.");
        } 
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
    addCommand(options, exec) {
        return this.command(options, exec);
    }
    removeCommand(name) {
        const commandToRemove = this.getCommand(name);
        if (commandToRemove) throw new Error("Command not found.");
        this.commands = this.commands.filter(command => command!=commandToRemove);
        return commandToRemove;
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
        for (let cmd of allCommandNames) {
            for (let a of nameAndAliases) {
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
        let args = [];

        if (options.hasOwnProperty('check')) checks = [options.check];
        if (options.hasOwnProperty('checks')) checks = options.checks;
        if (options.hasOwnProperty('cooldown')) cooldown = options.cooldown;
        if (options.hasOwnProperty('guildOnly')) guildOnly = options.guildOnly;
        if (options.hasOwnProperty('permissions')) guildOnly = options.permissions;
        if (options.hasOwnProperty('cog')) cog = options.cog;
        if (options.hasOwnProperty('args')) args = options.args;
        if (options.hasOwnProperty('arguments')) args = options['arguments'];

        // delete default options
        for (let option of Object.keys(options)) {
            if (["name", "alias", "aliases", "check", "checks", "cooldown", "guildOnly", "permissions", "cog", "args", "arguments"].includes(option)) {
                delete options[option];
            } 
        }

        const final = new Command(this, name, aliases, checks, guildOnly, permissions, cooldown, exec, options, cog, args);
        this.commands.push(final);
        return final;
    }
    getCommand(name) {
        //console.log(this.commands);
        if (this.commandsCaseInsensitive) name = name.toLowerCase();
        for (let command of this.commands) {
            if (command.name == name || command.aliases.includes(name)) 
                return command;
        } return null;
    }
    async getPrefix(message) {
        let content = message.content;
        if (this.prefixCaseInsensitive) content = content.toLowerCase();
        let prefix = this.prefix;
        if (typeof prefix == "function") {
            prefix = await prefix(this, message);
            if (this.prefixCaseInsensitive)
                prefix = prefix.toLowerCase();
        }
        if (typeof prefix == "string") {
            return content.startsWith(prefix) ? prefix : null;
        } else if (prefix instanceof Array) {
            for (prf of prefix) {
                if (content.startsWith(prf)) {
                    return prf;
                }
            }
            return null;
        } 
        return null;
    }
    async parseContext(message) {
        return await CommandContext.parseContext(message, this);
    }
    async processCommands(message) {
        if (message.author.bot) return;
        const context = await this.parseContext(message);
        if (!context) return;
        await context.invoke();
    }
}

module.exports = Bot;