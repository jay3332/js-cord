const { ConnectionError, InvalidEventError, ConstructionError } = require("./errors/DiscordEventError");

module.exports = {
    Client: require("./client/Client"),
    Bot: require("./client/Bot"),

    Check: require("./commands/Check"),
    Command: require("./commands/Command"),
    CommandContext: require("./commands/CommandContext"),
    Cooldown: require("./commands/Cooldown"),

    AllowedMentions: require("./structures/AllowedMentions"),
    ClientUser: require("./structures/ClientUser"),
    Embed: require("./structures/Embed"),
    Guild: require("./structures/Guild"),
    Member: require("./structures/Member"),
    Message: require("./structures/Message"),
    Messagable: require("./structures/Messagable"),
    Role: require("./structures/Role"),
    TextChannel: require("./structures/TextChannel"),
    User: require("./structures/User"),
    VoiceChannel: require("./structures/VoiceChannel"),

    errors: {
        ConnectionError: ConnectionError,
        InvalidEventError: InvalidEventError,
        ConstructionError: ConstructionError,
        CooldownError: require("./errors/CooldownError")
    }
};