const Client = require("./Client");
const Command = require("../commands/Command");
const { ConstructionError } = require("../errors/DiscordEventError");

module.exports = class Bot extends Client {
    constructor({ prefix, mentionAsPrefix=false, prefixCaseInsensitive=false, commandsCaseInsensitive=false, guildOnly=false, allowedMentions, intents, slash, debug }) {

        super({ allowedMentions: allowedMentions, intents: intents, slash: slash, debug: debug });

        this.allEvents.push(
            "command",
            "commandError",
            "commandComplete"
        );

        if (typeof mentionAsPrefix !== "boolean")
            throw new ConstructionError("Option `mentionAsPrefix` must be a boolean.");
        this.mentionAsPrefix = mentionAsPrefix;

        if (typeof prefixCaseInsensitive !== "boolean")
            throw new ConstructionError("Option `prefixCaseInsensitive` must be a boolean.");
        this.prefixCaseInsensitive = prefixCaseInsensitive;

        if (typeof commandsCaseInsensitive !== "boolean")
            throw new ConstructionError("Option `commandsCaseInsensitive` must be a boolean.");
        this.commandsCaseInsensitive = commandsCaseInsensitive;

        if (typeof guildOnly !== "boolean")
            throw new ConstructionError("Option `guildOnly` must be a boolean.");
        this.guildOnly = guildOnly;

        if (!prefix) throw new ConstructionError("Bots must have a prefix.");
        if (!(
            typeof prefix === "string" ||
            prefix instanceof Array    ||
            prefix instanceof Function
        )) {
            throw new ConstructionError(
                "Option `prefix` must be a string, an array of strings, or a function returns a string or array of strings.");
        }

        if (prefix instanceof Array && prefix.some(prefix => typeof prefix !== "string")) {
            throw new ConstructionError(
                "Option `prefix` must be a string, an array of strings, or a function returns a string or array of strings.");
        }

        if (this.prefixCaseInsensitive) {
            if (typeof prefix === "string") prefix = prefix.toLowerCase();
            else if (prefix instanceof Array) prefix = prefix.map(prefix => prefix.toLowerCase());
        }

        this.prefix = prefix;

        this.listen("message", async(msg) => {
            await this.processCommands(msg);
        });
        this.listen("commandError", (ctx, error) => {
            throw error;
        });

        this.cooldowns = {};
        this.commands = [];
        this.cogs = [];
    }

    async getPrefix(message) {
        /**
            Gets the prefix in relation to a message.
            If the message doesn't start with a prefix, it will return null
        */
        let content = message.content;
        if (this.prefixCaseInsensitive)
            content = content.toLowerCase();
        if (typeof this.prefix === "string") {
            if (content.startsWith(this.prefix))
                return this.prefix;
            return null;
        } else if (this.prefix instanceof Array) {
            let found = this.prefix.find(prefix => content.startsWith(prefix));
            return found || null;
        } else if (this.prefix instanceof Function) {
            let prefix = await this.prefix(this, message);
            if (!(
                typeof prefix === "string" ||
                prefix instanceof Array    ||
                prefix instanceof Function
            )) {
                throw new ConstructionError(
                    "Option `prefix` must be a string, an array of strings, or a function returns a string or array of strings.");
            }

            if (prefix instanceof Array && prefix.some(prefix => typeof prefix !== "string")) {
                throw new ConstructionError(
                    "Option `prefix` must be a string, an array of strings, or a function returns a string or array of strings.");
            }

            if (this.prefixCaseInsensitive) {
                if (typeof prefix === "string") prefix = prefix.toLowerCase();
                else if (prefix instanceof Array) prefix = prefix.map(prefix => prefix.toLowerCase());
            }

            if (typeof prefix === "string") {
                if (content.startsWith(prefix))
                    return prefix;
                return null;
            } else if (prefix instanceof Array) {
                let found = prefix.find(pf => content.startsWith(pf));
                return found || null;
        }
    }

    getCommand(query) {
        /*
         * Gets a command from a string
        */
        query = query.trim();
        if (this.commandsCaseInsensitive) query = query.toLowerCase();
        return this.commands.find(cmd => cmd.name===query || cmd.aliases.includes(query));
    }

    async command(options, callback) {
        if (typeof options === "string") {
            options = { name: options }
        }
        // long asf constructor:
        // constructor(bot, name, aliases, hidden, checks, cooldown,
        // permissions, botPermissions, guildOnly, ownerOnly, nsfwOnly, args, cog, parent, options, callback)

        if (!options.name)
            throw new Error("Command options must have `name`.");
        const name = options.name;

        // define default values
        let cog;
        let args = [];
        let aliases = [];
        let hidden = false;
        let checks = [];
        let parent;
        let cooldown;
        let permissions;
        let botPermissions;
        let guildOnly = this.guildOnly;
        let ownerOnly = false;
        let nsfwOnly = false;

        if (options.alias) aliases = [options.alias];
        if (options.aliases) aliases.push(...options.aliases);
        if (options.check) checks = [options.check];
        if (options.checks) checks.push(...options.check);
        if (options.hidden) hidden = options.hidden;
        if (options.cooldown) cooldown = options.cooldown;
        if (options.permissions) permissions = options.permissions;
        if (options.botPermissions) botPermissions = options.botPermissions;
        if (options.guildOnly) guildOnly = options.guildOnly;
        if (options.ownerOnly) ownerOnly = options.ownerOnly;
        if (options.nsfwOnly) nsfwOnly = options.nsfwOnly;
        if (options.args) args = options.args;
        if (options['arguments']) args = options['arguments'];
        if (options.cog) cog = options.cog;
        if (options.parent) parent = options.parent;

        const command = new Command(this, name, aliases, hidden, checks, cooldown, permissions, botPermissions,
            guildOnly, ownerOnly, nsfwOnly, args, cog, parent, options, callback);

        this.commands.push(command);
        return command;
    }
}
