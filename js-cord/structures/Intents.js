const Flags = require("../util/Flags");
const Constants = require("../util/Constants");

const bitLengthOf = n => n.toString(2).match(/1/g).length;

module.exports = class Intents extends Flags {
    constructor(options) {
        super(constants.INTENT_FLAG_VALUES);
        for (option of Object.keys(Constants.INTENT_FLAG_VALUES)) {
            if (Object.keys(options).includes(option)) {
                Object.defineProperty(this, option, options[option]);
            };
        }

    }
    static fromValue(value) {
        super.value = value;
        return this;
    }
    static all() {
        const bits = bitLengthOf(Math.max(Object.values(this.FLAGS)));
        const newValue = (1<<bits) - 1;
        return Intents.fromValue(newValue);
    }
    static none() {
        return Intents.fromValue(0);
    }
    static default() {
        // everything except for messages and presences
        return new Intents({
            guilds: true,
            members: false,
            bans: true,
            emojis: true,
            integrations: true,
            webhooks: true,
            invites: true,
            voice: true,
            presences: false,
            messages: true,
            reactions: true,
            typing: true
        });
    }
}