const Converter = require('./Converter');
const { UserNotFound } = require('../../Errors');

module.exports = class UserConverter extends Converter {

    async convert(ctx, argument) {
        let match;
        argument = argument.trim();

        // If it's a mention, strip it to it's ID
        if (argument.match(/^<@!?[0-9]{17,}>$/g)) {
            argument = argument.replace(/[<@!>]/g, '');
        }

        // If the user provided an ID, we can look through the cache for that.
        if (argument.match(/^[0-9]{17,}$/g)) {
            if (match = ctx.bot.getUser(argument)) {
                return match;
            }
        } 
        
        // Finally query users by their names
        match = ctx.bot.users.find(user => user.name === argument || user.tag === argument);

        throw new UserNotFound(argument);
    }
}