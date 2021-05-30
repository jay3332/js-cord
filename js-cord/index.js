const utils = require('./utils');
const enums = require('./enums');
const Color = require('./models/Color');

/**
 * js-cord
 */
module.exports = {
    /**
     * The client class
     */
    Client: require('./client/Client'),

    /**
     * Discord models
     */
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

    /**
     * Interactions
     */
    SlashCommand: require('./interactions/slash/SlashCommand'),
    SlashCommandOption: require('./interactions/slash/SlashCommandOption'),
    SlashContext: require('./interactions/slash/SlashContext'),
    Components: require('./interactions/components/Components'),
    Component: require('./interactions/components/Component'),
    ActionRow: require('./interactions/components/ActionRow'),
    Button: require('./interactions/components/Button'),
    Dropdown: require('./interactions/components/Dropdown'),
    DropdownOption: require('./interactions/components/DropdownOption'),

    /**
     * Parent utilities
     */
    constants: require('./constants'),
    enums,
    utils,

    /**
     * Pagination
     */
    BasePaginator: utils.BasePaginator,
    Paginator: utils.Paginator,

    /**
     * Enumerations
     */
    AuditLogEvent: enums.AuditLogEvent,
    ButtonStyle: enums.ButtonStyle,
    ChannelType: enums.ChannelType,
    ComponentType: enums.ComponentType,
    InteractionType: enums.InteractionType,
    InteractionResponseType: enums.InteractionResponseType,
    MessageType: enums.MessageType,
    MessageActivityType: enums.MessageActivityType,
    SlashCommandOptionType: enums.SlashCommandOptionType,
    StickerFormatType: enums.StickerFormatType,

    /**
     * Plugins
     */
    plugins: {
        /**
         * Commands plugin
         */
        commands: require('./plugins/commands')
    }
}
