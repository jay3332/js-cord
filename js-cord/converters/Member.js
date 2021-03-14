const BaseConverter = require('./BaseConverter');
const ConversionError = require('../errors/ConversionError');

module.exports = class MemberConverter extends BaseConverter {
    convert(ctx, argument) {
        const users = ctx.guild.members;
        let filtered;
        // parse mentions
        if (argument.match(/<@!?\d{17,}>/)) {
            argument = argument.replace(/[<@!>]/g, "");
        }
        if (argument.match(/\d{17,}/)) {
            // check ids
            filtered = users.filter(user => user.id === argument);
            if (filtered.length > 0) return filtered[0];
        }
        if (argument.match(/.{2,32}#\d{4}/)) {
            // check user#discrim
            filtered = users.filter(user => user.toString() === argument);
            if (filtered.length > 0) return filtered[0];
        }
        if (argument.match(/.{1,32}/)) {
            // check username
            filtered = users.filter(user => user.name === argument);
            if (filtered.length > 0) return filtered[0];

            // check nickname
            filtered = users.filter(user => user.nick === argument);
            if (filtered.length > 0) return filtered[0];
        }

        // throw an error
        throw new ConversionError(`Member "${argument}" not found.`);
    }
}