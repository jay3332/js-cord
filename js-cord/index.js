/**
 * js-cord
 * =======
 * All properties should follow camelCase.
 * The last word should be all uppercase if it is `ID`, `URL` 
 *                          ... or another short abbreviation.
 * 
 * E.g.: jumpURL, channelID, someOtherMethod
 */

const utils = require('./utils');
const enums = require('./enums');
const Color = require('./models/Color');

module.exports = {
    Client: require('./client/Client'),
    Queue: require('./core/Queue'),

    AllowedMentions: require('./models/AllowedMentions'),
    Asset: require('./models/Asset'),
    AuditLogEntry: require('./models/AuditLogEntry'),
    Bitfield: require('./models/Bitfield'),
    Channel: require('./models/Channel'),
    ClientUser: require('./models/ClientUser'),
    Color,
    Colour: Color,
    DiscordObject: require('./models/DiscordObject'),
    Embed: require('./models/Embed'),
    File: require('./models/File'),
    Guild: require('./models/Guild'),
    GuildChannel: require('./models/GuildChannel'),
    Intents: require('./models/Intents'),
    InvertedBitfield: require('./models/InvertedFlags'),
    Member: require('./models/Member'),
    Message: require('./models/Message'),
    MessageBuilder: require('./models/MessageBuilder'),
    Permissions: require('./models/Permissions'),
    SnowflakeSet: require('./models/SnowflakeSet'),
    TextChannel: require('./models/TextChannel'),
    User: require('./models/User'),

    loggers: require('./loggers'),
    constants: require('./constants'),
    enums,
    utils,

    BasePaginator: utils.BasePaginator,
    Paginator: utils.Paginator,

    AuditLogEvent: enums.AuditLogEvent,
    ChannelType: enums.ChannelType,
    MessageType: enums.MessageType,
    MessageActivityType: enums.MessageActivityType,
    StickerFormatType: enums.StickerFormatType,

    plugins: {
        commands: require('./plugins/commands')
    }
}
