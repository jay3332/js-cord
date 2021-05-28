const Client = require('../../client/Client');
const { DiscordError } = require('../../errors/Errors');
const CommandErrors = require('./Errors');
const { maybePromise } = require('../../utils');
const Context = require('./models/Context');
const Command = require('./models/Command');
const { BasicReverseStringView } = require('./View');

const botDefaults = { 
    prefix: undefined,
    prefixCaseInsensitive: false,
    commandsCaseInsensitive: true,
    stripAfterPrefix: false, 
    helpCommand: undefined,
    description: undefined,
    flagPrefix: '--',
    shortFlagPrefix: '-'
}

module.exports = class Bot extends Client {
    constructor(options) {
        if (typeof options === 'object') {
            let clientOptions = {}
            for (let [option, value] of Object.entries(options)) {
                if (!Object.keys(botDefaults).includes(option)) {
                    clientOptions[option] = value;
                }
            }
            super(clientOptions);
            this.#setupOptions({...botDefaults, ...options});
        } else if (typeof options === 'string') {
            super();
            this.#setupOptions({...botDefaults, prefix: options})
        } else {
            throw new TypeError('Options must be a string or object.')
        }

        this.commands = [];
        this.addDefaultListeners();
    }

    #setupOptions(opts) {
        if (!opts.prefix) 
            throw new CommandErrors.ConstructionError('Prefix is a required option that is missing.');
        if (!(['string', 'function'].includes(typeof opts.prefix) || opts.prefix instanceof Array)) 
            throw new CommandErrors.ConstructionError(
                'Prefix must be a string, array of strings, or a function that returns a string or array of strings.'
            );

        this.prefix = opts.prefix;
        this.prefixCaseInsensitive = opts.prefixCaseInsensitive;
        this.commandsCaseInsensitive = opts.commandsCaseInsensitive;
        this.description = opts.description;
        this.helpCommand = opts.helpCommand;
        this.flagPrefix = opts.flagPrefix;
        this.shortFlagPrefix = opts.shortFlagPrefix;
    }

    /**
     * Adds the default listeners to the bot.
     */
    addDefaultListeners() {
        this.on('commandError', async (_, exc) => {
            console.error(exc);
        });
        this.on('message', async (msg) => {
            if (msg.author.bot) return;
            let ctx = await this.getContext(msg)
            
            if (
                ctx 
                && ctx.command != undefined
                && ctx.args != undefined
                && ctx.flags != undefined
            ) 
                await this.invoke(ctx);
        })
    }

    /**
     * Parses a prefix from a message. (if found)
     * @param {Message} message
     * @returns {Promise<?string>} The prefix found in the message.
     */
    async getPrefix(message) {
        const content = message.content;
        let prefix = this.prefix;
        if (typeof prefix === 'function') {
            prefix = await maybePromise(prefix, this, message);
            if (!(typeof prefix === 'string' || prefix instanceof Array)) {
                throw new DiscordError('Prefix function must return a string or array of strings.')
            }
        }
        if (prefix instanceof Array) {
            if (prefix.some(pf => typeof pf !== 'string')) {
                throw new DiscordError('Prefix array contains non-string elements.');
            }
        } else if (typeof prefix !== 'string') {
            throw new DiscordError('Prefix must be a string or array of strings.');
        }

    
        let prefixes = prefix instanceof Array ? prefix : [ prefix ];
        prefixes = prefixes.sort((a, b) => b.length - a.length);

        if (this.prefixCaseInsensitive)
            content = content.toLowerCase();

        for (let pf of prefixes) {
            if (this.prefixCaseInsensitive)
                pf = pf.toLowerCase();
            if (content.startsWith(pf))
                return pf;
        }
        
        /* to-do: stripAfterPrefix option */
    }

    /**
     * Gets a command by name.
     * @param {string} query The command query.
     * @returns {Command} The command found from the search.
     */
    getCommand(query) {
        query = query.trim();
        const formatFn = this.commandsCaseInsensitive ? (s => s.toLowerCase()) : (s => s);
        if (this.commandsCaseInsensitive) query = query.toLowerCase();
        return this.commands.find(cmd => formatFn(cmd.qualifiedName) == query);

        /* to-do: alias support */
    }

    /**
     * Returns the parsed context of amessage.
     * @param {Message} message
     * @returns {Context} The parsed context of the message.
     */
    async getContext(message) {
        let ctx = new Context(this, message);
        ctx.prefix = await this.getPrefix(message);
        if (ctx.prefix == undefined) return;  // The message probably doesn't start with a prefix

        // Some commands have spaces in them, so we will 
        // do a reverse string view. Not to mention subcommands.
        let query = message.content.slice(ctx.prefix.length);
        let view = new BasicReverseStringView(query);
        let foundCommand, word;

        while (!view.eof) {
            word = view.getWord();
            foundCommand = this.getCommand(word);
            if (foundCommand) {
                ctx.invokedWith = word;
                ctx.command = foundCommand;
                break;
            }
        }

        try { 
            if (!ctx.command) {
                throw new CommandErrors.CommandNotFound(query);
            }

            let rest = view.getRest().trim();
            [ ctx.args, ctx.flags ] = await ctx.command.getArguments(ctx, rest); 
        } catch (exc) {  
            await this.emit('commandError', ctx, exc);
        }
        return ctx;
    }

    /**
     * Invokes a command from a Context object.
     * @param {Context} ctx
     */
    async invoke(ctx) {
        // insert checks
        await ctx.invoke(ctx.command, ctx.args, ctx.flags);
    }

    /**
     * Adds a command to the bot.
     * @param {Object} options The command options.
     * @param {function} callback The command callback.
     */
    command(options, callback) {
        if (typeof options === 'string') {
            options = { name: options };
        }

        const command = new Command(
            this, options.name, options.aliases, undefined, undefined, 
            options.args, options.flags, undefined, options
        );
        this.commands.push(command);
        command.callback = callback;
    }

    /* to-do: dynamic flag prefixes */

    /**
     * Gets the bot's flag prefix.
     * @param {Message} message
     * @returns {string} The long flag prefix.
     */
    async getFlagPrefix(message) {
        return this.flagPrefix;
    }
    
    /**
     * Gets the bot's short flag prefix.
     * @param {Message} message
     * @returns {string} The short flag prefix.
     */
    async getShortFlagPrefix(message) {
        return this.shortFlagPrefix;
    }
}
