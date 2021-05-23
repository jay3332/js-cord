class DiscordError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = {
    DiscordError,
    BadFormat: class extends DiscordError {},
    ConstructionError: class extends DiscordError {},
    InvalidToken: class extends DiscordError {}
}
