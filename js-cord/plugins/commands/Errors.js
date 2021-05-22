const { DiscordError } = require('../../errors/Errors');

module.exports = {
    CommandError: class extends DiscordError {},
    ConstructionError: class extends CommandError {}
}
