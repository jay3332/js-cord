const BaseConverter = require('./BaseConverter');
const ConversionError = require('../errors/ConversionError');

module.exports = class TextChannelConverter extends BaseConverter {
    convert(ctx, arg) {
        let result;
        const channels = ctx.guild.textChannels;
        // convert from mention
        if (arg.match(/\<#\d{17,}\>/)) {
            arg = arg.replace(/[\<#\>]/g);
        }
        // check id
        if (arg.match(/\d{17,}/)) {
            result = channels.find(channel => channel.id === arg);
            if (result) return result;
        }
        // check name
        result = channels.find(channel => channel.name === arg);

        // user is somehow dumb, throw an error
        throw new ConversionError(`Text channel "${arg}" not found.`) ;
    }
}
