/**
 * Extension of Client, adds extra features such as command managers.
 * If you have a "message" listener, you must re-process your commands.
*/

const Client = require("./Client");
const { ConstructionError } = require("../errors/DiscordEventError");
const { Check } = require('../commands/Check'),
	{ Command } = require('../commands/Command'),
	{ CommandContext } = require('../commands/CommandContext'),
	{ Cooldown } = require('../commands/Cooldown')

class Bot extends Client {
    constructor(obj) {
        const superclass = super();
        superclass.allEvents.push(
            "command",
            "commandError",
            "commandComplete"
        );

        this.prefix = "";
        this.prefixCaseInsensitive = false;
        this.commandsCaseInsensitive = false;

        this.commands = [];
        this.commandCooldowns = new Map();

        if (["string", "function", "array"].includes(typeof obj)) {
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
        superclass.listeners.set("message", message => {
            const context = parseContext(message, this);
            if (isNaN(context)) return;
            context.invoke();
        });
    }
    command(settings, exec) {
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const ARGUMENT_NAMES = /([^\s,]+)/g;

        let fnStr = exec.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if(result === null) result = [];

        if (!result.length) throw new Error("Command execution function requires a context parameter.")

        if (typeof settings == "string") {
            settings = {name: settings}
        } if (! (typeof settings == "object")) {
            throw new Error("Command settings must be a string or object.")
        } if (!settings.hasOwnProperty('name')) {
            throw new Error("\"name\" is a required object parameter.")
        } 

        const name = settings.name;
        let aliases = [];
        if (settings.hasOwnProperty('aliases')) aliases = settings.aliases;
        if (settings.hasOwnProperty('alias'))   aliases = [settings.alias];
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
        if (settings.hasOwnProperty('check')) checks = [settings.check];
        if (settings.hasOwnProperty('checks')) checks = settings.checks;
        if (settings.hasOwnProperty('cooldown')) cooldown = settings.cooldown;

        this.commands.push(new Command(name, aliases, "", checks, cooldown, exec));
    }
    getCommand(name) {
        if (this.commandsCaseInsensitive) name = name.toLowerCase();
        for (command of this.commands) {
            nameAndAliases = [command.name, ...command.aliases];
            if (nameAndAliases.contains(name)) return command;
        }
    }
}

module.exports = Bot