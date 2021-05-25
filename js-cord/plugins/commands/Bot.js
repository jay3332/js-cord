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
    description: undefined
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
            this.#setupOptions({botDefaults, ...options});
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
    }

    addDefaultListeners() {
        this.on('commandError', async (_, exc) => {
            console.error(exc);
        });
        this.on('message', async (msg) => {
            if (msg.author.bot) return;
            let ctx = await this.getContext(msg)
            if (ctx) await this.invoke(ctx);
        })
    }

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
        
        /**
         * TODO: stripAfterPrefix option
         */
    }

    getCommand(query) {
        query = query.trim();
        const formatFn = this.commandsCaseInsensitive ? (s => s.toLowerCase()) : (s => s);
        if (this.commandsCaseInsensitive) query = query.toLowerCase();
        return this.commands.find(cmd => formatFn(cmd.qualifiedName) == query);
    }

    async getContext(message) {
        let ctx = new Context(this, message);
        ctx.prefix = await this.getPrefix(message);
        if (!ctx.prefix) return;  // The message probably doesn't start with a prefix

        // Some commands have spaces in them, so we will 
        // do a reverse string view. Not to mention subcommands.
        let query = message.content.slice(ctx.prefix.length);
        let view = new BasicReverseStringView(query);
        let foundCommand;

        while (!view.eof) {
            foundCommand = this.getCommand(view.getWord())
            if (foundCommand) {
                ctx.command = foundCommand;
                break;
            }
        }

        if (!ctx.command) {
            throw new CommandErrors.CommandNotFound(query);
        }

        let rest = view.getRest().trim();
        [ ctx.args, ctx.flags ] = await ctx.command.getArguments(ctx, rest);
        return ctx;
    }

    async invoke(ctx) {
        // insert checks
        await ctx.invoke(ctx.command, ctx.args, ctx.flags);
    }

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

    // For flags, which are WIP
    async getFlagPrefix() {}
    async getShortFlagPrefix() {}
}
