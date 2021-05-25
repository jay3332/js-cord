const { 
    NotImplementedError,
    ConversionError,
    MissingRequiredArgument,
    CommandError,
    ArgumentParsingError
} = require('../Errors');
const DefaultConverters = require('./converters/DefaultConverters');
const Converter = require('./converters/Converter');
const { StringView } = require('../View');
const { maybePromise, isSubclass } = require('../../../utils');
const { ArgumentParser: _ArgumentParser } = require('argparse');


class ArgumentParser extends _ArgumentParser {
    constructor(...args) {
        super(...args);
    }

    error(..._) {}
}


const converterMapping = {
    string: DefaultConverters.StringConverter,
    str: DefaultConverters.StringConverter,
    text: DefaultConverters.StringConverter,
    number: DefaultConverters.NumberConverter,
    float: DefaultConverters.NumberConverter,
    num: DefaultConverters.NumberConverter,
    double: DefaultConverters.NumberConverter,
    integer: DefaultConverters.IntegerConverter,
    int: DefaultConverters.IntegerConverter,
    bigint: DefaultConverters.BigIntConverter,
    boolean: DefaultConverters.BooleanConverter,
    bool: DefaultConverters.BooleanConverter,
    member: require('./converters/MemberConverter'),
    user: require('./converters/UserConverter')
}


function sanitizeConverter(converter, __recur = true) {
    // Turns a converter into a Converter class.
    if (typeof converter === 'function') {
        converter = class extends Converter {
            async convert(ctx, argument) {
                return await maybePromise(converter, ctx, argument);
            }
        }
    } else if (converter instanceof Converter) {
        converter = class extends Converter {
            async convert(ctx, argument) {
                return await converter.convert(ctx, argument);
            }
        } 
    } else if (typeof converter === 'string') {
        converter = converterMapping[converter.toLowerCase()];
    } else if ([Boolean, Number, BigInt, String].includes(converter)) {
        switch (converter) {
        case String:
            converter = DefaultConverters.StringConverter;
            break;
        case Boolean:
            converter = DefaultConverters.BooleanConverter;
            break;
        case Number:
            converter = DefaultConverters.NumberConverter;
            break;
        case BigInt:
            converter = DefaultConverters.BigIntConverter;
            break;
        case require('../../../models/Member'):
            converter = require('./converters/MemberConverter');
            break;
        case require('../../../models/User'):
            converter = require('./converters/UserConverter');
            break;
        }
    } else if (converter instanceof Array && __recur) {
        // This means that the converter is a union converter.
        converter = class extends Converter {
            async convert(ctx, argument) {
                let errors = [];
                for (let maybeConverter of converter) {
                    try {
                        maybeConverter = sanitizeConverter(maybeConverter, false);
                        return await maybeConverter().convert(ctx, argument);
                    } catch(exc) {
                        errors.push(exc);
                    }
                }
                throw new ConversionError(errors[errors.length-1]);
            }
        }
    } else if (!isSubclass(converter, Converter)) {
        throw new TypeError('Converters must extend `Converter`.');
    }
    return converter;
}


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
        this._sanitizeArguments();
        this._loadOptions(options);
    }

    _sanitizeArguments() {
        for (let arg of this.args) {
            // The `optional` option will be primarily used.
            if (arg.required != undefined) {
                arg.optional = !arg.required;
            }

            // If there is a default value, make it optional.
            if (arg.optional == undefined && arg.default != undefined) {
                arg.optional = true;
            }

            // The `type` alias can be used in favor of `converter`
            if (arg.type && !arg.converter) {
                arg.converter = arg.type;
            }

            if (arg.converter) {
                arg.converter = sanitizeConverter(arg.converter);
            }

            // If no converter was given, default to StringConverter
            if (!arg.converter) {
                arg.converter = DefaultConverters.StringConverter;
            }
        }

        for (let flag of this.flags) {
            // All we have to do is sanitize converters
            // The `type` alias can be used in favor of `converter`
            if (flag.type && !flag.converter) {
                flag.converter = flag.type;
            }

            if (flag.converter) {
                flag.converter = sanitizeConverter(flag.converter);
            }

            // If no converter was given, default to StringConverter
            if (!flag.converter) {
                flag.converter = DefaultConverters.StringConverter;
            }

            if (flag.short != undefined && flag.short.length !== 1) {
                throw new SyntaxError('Shorthand flag names must be one character long.')
            } 

            if (!flag.aliases) flag.aliases = [];
            if (flag.alias) flag.aliases.push(flag.alias);
        }
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

            let idx;
            for (let case_ of cases) {
                idx = content.indexOf(' ' + case_);
                if (idx !== -1) {
                    if (idx < flagSplitter || flagSplitter == undefined) {
                        flagSplitter = idx;
                    }
                } else {
                    idx = content.indexOf(case_);
                    if (idx === 0) {
                        flagSplitter = idx; 
                        break
                    }
                }
            }
        }

        let args, flags;
        if (flagSplitter != undefined) {
            args = await this._parseArguments(ctx, content.slice(0, flagSplitter));
            flags = await this._parseFlags(ctx, content.slice(flagSplitter).trim(), flagPrefix, shorthandPrefix);
            return [ args, flags ];            
        } 

        args = await this._parseArguments(ctx, content);
        return [ args, {} ]
    } 

    async _parseArguments(ctx, content) {
        let view = new StringView(content);
        let result = {};
        let buffer;

        for (let arg of this.args) {
            if (arg.array) {
                // Greedily consume until we get an error
                result[arg.name] = [];

                while (!view.eof) {
                    buffer = view.getWord({ skipSpace: true });
                    if (!buffer) break;

                    try {
                        buffer = await (new arg.converter()).convert(ctx, buffer);
                        result[arg.name].push(buffer);
                    } catch (exc) {
                        break;
                    }
                }
                continue;
            }
            buffer = arg.consume 
                ? view.getRest()
                : view.getWord({ skipSpace: true });

            if (buffer) { 
                try {
                    buffer = await (new arg.converter()).convert(ctx, buffer);
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

        return result;
    }

    #replaceLongDash(content) {
        // On mobile, -- is usually replaced by an em dash. Here we reverse this.
        let result = content.split(' ');
        for (let [i, arg] of result.entries()) {
            if (arg.startsWith("\u2014")) {
                arg = arg.replace(/\u2014/g, '--');
                result[i] = arg;
            }
        }

        return result.join(' ');
    }

    async _parseFlags(ctx, content, flagPrefix, shortPrefix) {
        content = this.#replaceLongDash(content);
        console.log(content);

        let parser = new ArgumentParser();
        for (let flag of this.flags) {
            let allNames = [flag.name, ...flag.aliases]
                .map(fl => flagPrefix + fl);
            if (flag.short) allNames.push(shortPrefix + flag.short);

            let options = flag.storeTrue 
                ? { action: 'storeTrue' }  
                : { nargs: '+' };

            parser.addArgument(allNames, { ...options, default: flag.default, dest: flag.name }); 
        }

        let fl, parsed;
        let result = {};
        try {
            parsed = parser.parseArgs(content.split(' ')); // Space to preserve newlines
        } catch (exc) {
            throw new ArgumentParsingError('Bad usage of flags.');
        }

        for (let [ key, value ] of Object.entries(parsed)) {
            if (typeof value === 'boolean') {
                result[key] = value;
                continue;
            }

            if (value === null) {
                result[key] = undefined;
            }
            if (value instanceof Array)
                value = value.join(' ');
            try { 
                fl = this.flags.find(f => f.name === key);
                result[key] = await (new fl.converter()).convert(ctx, value);
            } catch (exc) {
                throw new ConversionError(exc);
            }
        }

        console.log(result);
        return result;
    }
 
    async invoke(ctx, args, flags) {
        try {
            await this.beforeInvoke(ctx);
            await this._bot.emit('command', ctx);
            await this.callback(ctx, args, flags);
            await this.afterInvoke(ctx);
        } catch (exc) {
            await this.onError(ctx, exc);
            await this._bot.emit('commandError', ctx, exc);
        }
        await this._bot.emit('commandComplete', ctx);
    }
}
