module.exports = {
    DiscordError: class extends Error {
        constructor(message) {
            super(message);
        }
    },

    BadFormat: class extends DiscordError {},
    ConstructionError: class extends DiscordError {}
}
