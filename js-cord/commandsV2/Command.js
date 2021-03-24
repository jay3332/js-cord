const Check = require('../commands/Check')
const Cooldown = require("../commands/Cooldown");

const UserConverter = require("../converters/User");
const MemberConverter = require("../converters/Member");
const { parseHex } = require("../util/Useful");

/*const {
    CheckError,
    NSFWOnlyError,
    GuildOnlyError,
    PermissionError
} = require("../errors/DiscordEventError");*/

const DEFAULT_TYPES = {
    "string": (_, arg) => arg.toString(),
    "integer": (_, arg) => parseInt(arg),
    "float": (_, arg) => parseFloat(arg),
    "number": (_, arg) => Number(arg.replace(",", "").replace(" ", "")),
    "boolean": (_, arg) => {
        const yeses = [
            "1", "yes", "y", "true",
            "t", "enabled", "enable",
            "on", "accept", "agree"
        ];
        const nos = [
            "0", "no", "n", "false",
            "f", "disabled", "disable",
            "off", "disagree", "reject"
        ];
        if (![...yeses, ...nos].includes(arg.toLowerCase())) {
            throw new TypeError(`Can't convert ${arg} to boolean`);
        }
        return yeses.includes(arg.toLowerCase());
    },
    "user": (ctx, arg) => {
        let result = new UserConverter().convert(ctx, arg);
        if (!result) throw new TypeError(`User ${arg} not found.`);
        return result;
    },
    "member": (ctx, arg) => {
        let result = new MemberConverter().convert(ctx, arg);
        if (!result) throw new TypeError(`Member ${arg} not found.`);
        return result;
    },
    "colour": (_, arg) => {
        let result = parseHex(arg);
        if (!result) throw new TypeError(`Invalid colour "${arg}"`);
        return result;
    },
    "color": (_, arg) => {
        let result = parseHex(arg);
        if (!result) throw new TypeError(`Invalid color "${arg}"`);
        return result;
    },
    "role": null,
    "channel": null,
    "message": null,
    "guild": null,
    "emoji": null,
    "partialemoji": null,
    "textchannel": null,
    "voicechannel": null,
    "globalchannel": null,
    "globaltextchannel": null,
    "globalvoicechannel": null,
    "command": (ctx, arg) => {
        let result = ctx.bot.getCommand(arg);
        if (!result) throw new TypeError(`Command ${arg} not found.`);
        return result;
    },
};

function getUnionFunction(types) {
    types = types.map(type => {
        if (!['string', 'function'].includes(typeof type)) {
            throw new TypeError("Argument type must be a string or function.")
        }
        const buffer = (typeof type === "string") ?
        type.toLowerCase().replace("_", "").replace(" ", "") : type;
        if (typeof type === "string") {
            if (!Object.keys(DEFAULT_TYPES).includes(type)) {
                throw new ReferenceError(`Default type "${type}" not found.`);
            } else {
                return DEFAULT_TYPES[type];
            }
        }
        else { return type };

    });
    if (!Object.keys(DEFAULT_TYPES).includes(arg.type)) {
        throw new ReferenceError("Default type not found.");
    }

    return async (ctx, arg) => {
        let result;
        for (let type of types) {
            try {
                result = await thistype(ctx, arg);
                return result;
            } catch (err) {
                continue;
            }
        }
        throw new TypeError("All union type converters failed.");
    }
}

module.exports = class Command {
    constructor(bot, name, aliases, hidden, checks, cooldown, permissions, botPermissions, guildOnly, ownerOnly, nsfwOnly, args, cog, parent, options, callback) {
        this.bot = bot;
        this.name = name;
        this.aliases = aliases;
        this.hidden = hidden;
        this.checks = checks;
        this.cooldown = cooldown;
        this.permissions = permissions;
        this.botPermissions = botPermissions;
        this.guildOnly = guildOnly;
        this.ownerOnly = ownerOnly;
        this.nsfwOnly = nsfwOnly;
        this.cog = cog;
        this.parent = parent;
        this.callback = callback;
        this.onError = this.onError = (_, err) => {
            throw err;
            //this.bot.emit("commandError", [this, error]);
        }

        if (args.length) {
            for (let arg of args) {
                if (!arg.name) {
                    throw new Error("Arguments must have a name.");
                }
                arg.name = arg.name.toString();
                if (arg.default) {
                    if (arg.optional != null) {
                        if (!arg.optional) throw new Error("Optional arguments cannot be required.");
                    }
                    arg.optional = true;
                }
                if (!arg.type) arg.type = "string";
                if (!arg.type instanceof Function) {
                    if (arg.type instanceof Array) {
                        arg.type = getUnionFunction(arg.type);
                    }
                    if (typeof arg.type !== "string") {
                        throw new TypeError(
                            "Argument type must be a string which is a default type, an array of union types, "+
                            " or a function that returns a boolean for custom types.");
                    }
                    arg.type = arg.type.toLowerCase().replace("_", "").replace(" ", "");
                    if (!Object.keys(DEFAULT_TYPES).includes(arg.type)) {
                        throw new ReferenceError("Default type not found.");
                    }
                    arg.type = DEFAULT_TYPES[arg.type];
                }
                if (!arg.consume) arg.consume = 1;
                if (typeof arg.consume !== 'number') throw new TypeError("Argument consume length must be an integer.");
                if (!Number.isInteger(arg.consume)) throw new TypeError("Argument consume length must be an integer.");
                if (arg.consume === 0) arg.consume = 1;

                if (arg.validate) {
                    if (!arg.validate instanceof Function) {
                        throw new TypeError("Argument validation must be a function.")
                    }
                }
                // once that's done, the arguments should be valid.
            }
        } this.args = args;

        for (option of Object.keys(options)) {
            if (!this.hasOwnProperty(option))
                this[option] = options[option];
        }
    }
    get signature() {
        /**
         * Returns the signature / usage of the command, e.g.
         * <argument> [optional] [text...]
         */

        if (!this.args.length) return "";

        return this.args.map(arg => {
            const surround = arg.optional ? "[]" : "<>";
            const ending = [0, 1].includes(arg.consume) ? "" : "...";
            return surround[0] + arg.name + ending + surround[1]
        }).join(" ");
    }
    get fullName() {
        if (!this.parent) return this.name;
        return `${this.parent.fullName} ${this.name}`.trim();
    }
    get fullSignature() {
        return `${this.fullName} ${this.signature}`.trim();
    }
    error(fn) {
        this.onError = fn;
    }
    async passChecks(ctx) {
        /*
        this.checks = checks;
        this.permissions = permissions;
        this.botPermissions = botPermissions;
        this.guildOnly = guildOnly;
        this.ownerOnly = ownerOnly;
        this.nsfwOnly = nsfwOnly;
        */
        if (this.guildOnly && ['dm', 'group'].includes(ctx.channel.type)) return false;
        if (this.nsfwOnly && ctx.channel.nsfw) return false;
        if (this.ownerOnly && !ctx.author.isOwner) return false;
        
    }
}
