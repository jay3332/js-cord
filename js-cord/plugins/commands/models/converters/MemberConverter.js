const Converter = require('./Converter');
const { MemberNotFound } = require('../../Errors');

module.exports = class MemberConverter extends Converter {
    constructor({ caseInsensitive = false } = {}) {
        super();
        this.caseInsensitive = caseInsensitive;
    }

    async convert(ctx, argument) {
        let match;
        argument = argument.trim();

        // If it's a mention, strip it to it's ID
        if (argument.match(/^<@!?[0-9]{17,}>$/g)) {
            argument = argument.replace(/[<@!>]/g, '');
        }

        // If the user provided an ID, we can look through the cache for that.
        if (argument.match(/^[0-9]{17,}$/g)) {
            if (match = ctx.guild.getMember(argument)) {
                return match;
            }
        } 
        
        // Finally query members by their names
        if (match = ctx.guild.getMemberNamed(argument, { caseInsensitive: this.caseInsensitive })) {
            return match;
        }

        throw new MemberNotFound(argument);
    }
}