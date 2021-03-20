const BaseConverter = require('./BaseConverter');
const ConversionError = require('../errors/ConversionError');

module.exports = class MemberConverter extends BaseConverter {
    convert(ctx, arg) {
        const users = ctx.guild.members;
        let filtered;
        // parse mentions
        if (arg.match(/\<@!?\d{17,}\>/)) {
            arg = arg.replace(/[<@!>]/g, "");
        }
        if (arg.match(/\d{17,}/)) {
            // check ids
            filtered = users.find(user => user.id === arg);
            if (filtered) return filtered;
        }
        if (arg.match(/.{2,32}#\d{4}/)) {
            // check user#discrim
            filtered = users.find(user => user.toString() === arg);
            if (filtered) return filtered;
        }
        if (arg.match(/.{1,32}/)) {
            // check username
            filtered = users.find(user => user.name === arg);
            if (filtered) return filtered;

            // check nickname
            filtered = users.find(user => user.nick === arg);
            if (filtered) return filtered;
        }

        // throw an error
        throw new ConversionError(`Member "${arg}" not found.`);
    }
}
