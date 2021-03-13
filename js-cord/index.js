const { ConnectionError, InvalidEventError, ConstructionError } = require("./errors/DiscordEventError");

module.exports = {
    Client: require("./client/Client"),
    Bot: require("./client/Bot"),

    Check: require("./commands/Check"),
    Command: require("./commands/Command"),
    CommandContext: require("./commands/CommandContext"),
    Cooldown: require("./commands/Cooldown"),

    AllowedMentions: require("./structures/AllowedMentions"),
    Channel: require("./structures/Channel"),
    ClientUser: require("./structures/ClientUser"),
    Embed: require("./structures/Embed"),
    Guild: require("./structures/Guild"),
    Member: require("./structures/Member"),
    Message: require("./structures/Message"),
    Permissions: require("./structures/Permissions"),
    Reaction: require("./structures/Reaction"),
    Role: require("./structures/Role"),
    User: require("./structures/User"),

    errors: {
        ConnectionError: ConnectionError,
        InvalidEventError: InvalidEventError,
        ConstructionError: ConstructionError,
        CooldownError: require("./errors/CooldownError")
    }
};