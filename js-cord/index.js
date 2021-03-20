const {
    ConnectionError, InvalidEventError, ConstructionError,
    GuildOnlyError,  CheckError,        PermissionError
} = require("./errors/DiscordEventError");

module.exports = {
    Client: require("./client/Client"),
    Bot: require("./client/Bot"),

    Check: require("./commands/Check"),
    Cog: require("./commands/Cog"),
    Command: require("./commands/Command"),
    CommandContext: require("./commands/CommandContext"),
    Cooldown: require("./commands/Cooldown"),

    AllowedMentions: require("./structures/AllowedMentions"),
    Category: require("./structures/Category"),
    Channel: require("./structures/Channel"),
    ClientUser: require("./structures/ClientUser"),
    DMChannel: require("./structures/DMChannel"),
    Embed: require("./structures/Embed"),
    Emoji: require("./structures/Emoji"),
    Guild: require("./structures/Guild"),
    GuildChannel: require("./structures/GuildChannel"),
    Intents: require("./structures/Intents"),
    Invite: require("./structures/Invite"),
    Member: require("./structures/Member"),
    Message: require("./structures/Message"),
    Messageable: require("./structures/Messageable"),
    Permissions: require("./structures/Permissions"),
    Reaction: require("./structures/Reaction"),
    Role: require("./structures/Role"),
    TextChannel: require("./structures/TextChannel"),
    User: require("./structures/User"),
    VoiceChannel: require("./structures/VoiceChannel"),

    BaseConverter: require("./converters/BaseConverter"),
    UserConverter: require("./converters/User"),
    MemberConverter: require("./converters/Member"),
    TextChannelConverter: require("./converters/TextChannel"),

    errors: {
        ConnectionError: ConnectionError,
        InvalidEventError: InvalidEventError,
        ConstructionError: ConstructionError,
        GuildOnlyError: GuildOnlyError,
        PermissionError: PermissionError,
        CheckError: CheckError,
        CooldownError: require("./errors/CooldownError"),
        ConversionError: require("./errors/ConversionError")
    },

    Useful: require("./util/Useful"),
    Util: require("./util/Util")
};
