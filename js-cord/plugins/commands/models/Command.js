const { 
    NotImplementedError,
    ConversionError,
    MissingRequiredArgument
} = require('../Errors');
const { StringView } = require('../View');



module.exports = class Command {
    constructor(
        bot, name, aliases = [], cooldowns = [], checks = [], 
        args = [], flags = [], parent = null, options = {}
    ) {
        this._bot = bot;
        this.name = name;
        this.aliases = aliases;
        this.cooldowns = cooldowns;
        this.checks = checks;
        this.args = args;
        this.flags = flags;
        this.parent = parent;
        this._loadOptions(options);
    }  

    _loadOptions(options) {
        for (let [ option, value ] of Object.entries(options)) {
            if (!Object.keys(this).includes(option)) {
                this[option] = value;
            }
        }
    }

    get qualifiedName() {
        if (!this.parent) return this.name;
        let parents = this.parents.reverse();
        return [ ...parents.map(p => p.name), this.name ].join(' ')
    }

    get parents() {
        if (!this.parent) return [];
        let parents = [];
        let buffer = this;

        while (true) {
            if (buffer.parent) { 
                parents.push(buffer.parent);
                buffer = buffer.parent;
            } else { break };
        }
        return parents;
    }

    get commands() {
        let cmds = this._bot.allCommands.filter(cmd => cmd.parent == this);
        if (!cmds) return undefined;
        return cmds;
    }

    getSignature({ 
        required = '<>',
        optional = '[]',
        array = '...',
        defaultIndicator = '=',
        // includeFlags = false,
        separator = ' '
    } = {}) {   
        if (!this.args.length + this.flags.length) 
            return '';

        const _required = t => required[0] + t + required[1];
        const _optional = t => optional[0] + t + optional[1];

        let text;
        let parts = [];
        for (let arg of this.args) {    
            text = arg.name;
            if (arg.consume && arg.array) 
                text += array;
            if (arg.default != undefined) 
                text += defaultIndicator + arg.default.toString();
            
            parts.push((
                _optional ? arg.optional || arg.default : _required 
            )(text));
        }

        return parts.join(separator);
    }

    get signature() {
        return this.getSignature()
    }

    get usage() {
        return `${this.qualifiedName} ${this.signature}`.trim()
    }

    async beforeInvoke(_ctx) {}
    async afterInvoke(_ctx) {}
    async callback(_ctx, _args, _flags) {
        throw new NotImplementedError('Callback required for this command.')
    }
    async onError(_ctx, _error) {}

    async getArguments(ctx, content) {
        // Split the content into two groups: arguments and flags.
        let flagPrefix = await this._bot.getFlagPrefix(ctx.message);
        let shorthandPrefix = await this._bot.getShortFlagPrefix(ctx.message);
        let flagSplitter = undefined;

        for (let flag of this.flags) {
            let cases = [];
            if (flag.short) cases.push(shorthandPrefix + flag.short);
            cases.push(...flag.aliases.map(alias => flagPrefix + alias), flagPrefix + flag.name);

            for (let case_ of cases) {
                const idx = content.indexOf(' ' + case_);
                if (idx != undefined) {
                    if (!flagSplitter || idx < flagSplitter) {
                        flagSplitter = idx;
                    }
                }
            }
        }

        let args;
        let flags;
        if (flagSplitter != undefined) {
            args = await this._parseArguments(content.slice(0, flagSplitter));
            flags = this._parseFlags(content.slice(flagSplitter));
            return [ args, flags ];            
        } 

        args = await this._parseArguments(content);
        return [ args, {} ]
    } 

    async _parseArguments(ctx, content) {
        let view = new StringView(content);
        let result = {};
        let buffer;

        for (let arg of this.args) {
            if (arg.consume && !arg.array) {
                result[arg.name] = view.getRest();
                break;
            }
            if (arg.array) {
                // Greedily consume until we get an error
                while (!view.eof) {
                    buffer = view.getWord({ skipSpace: true });
                    if (!buffer) break;

                    try {
                        buffer = await new arg.converter(ctx).convert(buffer);
                        result[arg.name] = buffer;
                    } catch (exc) {
                        break;
                    }
                }
                continue;
            }
            buffer = view.getWord({ skipSpace: true });
            if (buffer) { 
                try {
                    buffer = await new arg.converter(ctx).convert(buffer);
                    result[arg.name] = buffer;
                } catch (exc) {
                    if (arg.optional) {
                        result[arg.name] = arg.default;
                    } else {
                        throw new ConversionError(exc);
                    }
                }
            } else {
                // We're probably out of arguments,
                // so raise MissingRequiredArgument or fill in defaults
                if (arg.optional) {
                    result[arg.name] = arg.default;
                } else {
                    throw new MissingRequiredArgument(arg);
                }
            }
        }
    }

    _parseFlags(content) {

    }
 
    async invoke(ctx, args, flags) {
        let callbackArgs = [ctx, args, flags].slice(0, this.callback.length);

        try {
            await this.beforeInvoke(ctx);
            await this._bot.emit('command', ctx);
            await this.callback(...callbackArgs);
            await this.afterInvoke(ctx);
        } catch (exc) {
            await this.onError(ctx, exc);
            await this._bot.emit('commandError', ctx, exc);
        }
        await this._bot.emit('commandComplete', ctx);
    }
}
