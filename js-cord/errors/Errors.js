class DiscordError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor?.name || 'DiscordError';
    }
}

module.exports = {
    DiscordError,
    BadFormat: class extends DiscordError {},
    ConstructionError: class extends DiscordError {},
    InvalidToken: class extends DiscordError {},
    HTTPError: class extends DiscordError {}
}
