class CommandContext {
    constructor(message, command, prefix, bot, args) {
        this.prefix = prefix;
        this.bot = bot;
        this.command = command;
        this.message = message;
        this.author = message.author;
        this.channel = message.channel;
        this.args = args;
    }
    invoke() {
        this.command.exec(this, ...args);
    }
    static parseContext(message, bot) {
        const buffer = bot.prefixCaseInsensitive
        ? message.content : message.content.toLowerCase();
        if (bot.prefix instanceof String) {
            if (!buffer.startsWith(bot.prefix)) return NaN;
        } else if (bot.prefix instanceof Array) {
            let temp = false;
            for (prefix of bot.prefix) {
                if (buffer.startsWith(prefix)) {
                    temp = true;
                }
            }
            if (!temp) return NaN;
        } else {
            const prefix = bot.prefix();
            if (prefix instanceof String && !buffer.startsWith(prefix))
                return NaN;
            else if (prefix instanceof Array) {
                if (!prefix.map(prf => buffer.startsWith(prf)).includes(true)) return NaN;
            }
        }
        return new CommandContext(message);
    }
};

module.exports = CommandContext;