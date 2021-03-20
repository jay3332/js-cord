const BaseConverter = require('./BaseConverter');
const ConversionError = require('../errors/ConversionError');

module.exports = class UserConverter extends BaseConverter {
    convert(ctx, arg) {
        const users = ctx.bot.users;
        // parse mentions
        if (arg.match(/\<@!?\d{17,}\>/)) {
            arg = arg.replace(/[\<@!\>]/g, "");
        } if (arg.match(/\d{17,}/)) {
            // check ids
            const filtered = users.find(user => user.id === arg);
            if (filtered) return filtered;
        } if (arg.match(/.{2,32}#\d{4}/)) {
            // check user#discrim
            const filtered = users.find(user => user.toString() === arg);
            if (filtered) return filtered;
        }
        // check username
        const filtered = users.find(user => user.name === arg);
        if (filtered) return filtered;

        // throw an error
        throw new ConversionError(`User "${arg}" not found.`);
    }
}
