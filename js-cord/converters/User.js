const BaseConverter = require('./BaseConverter');
const ConversionError = require('../errors/ConversionError');

module.exports = class UserConverter extends BaseConverter {
    convert(ctx, argument) {
        const users = ctx.bot.users;
        // parse mentions
        if (argument.match(/<@!?\d{17,}>/)) {
            argument = argument.replace(/[<@!>]/g, "");
        } if (argument.match(/\d{17,}/)) {
            // check ids
            const filtered = users.filter(user => user.id === argument);
            if (filtered.length > 0) return filtered[0];
        } if (argument.match(/.{2,32}#\d{4}/)) {
            // check user#discrim
            const filtered = users.filter(user => user.toString() === argument);
            if (filtered.length > 0) return filtered[0];
        } 
        // check username
        const filtered = users.filter(user => user.name === argument);
        if (filtered.length > 0) return filtered[0];

        // throw an error
        throw new ConversionError(`User "${argument}" not found.`);
    }
}