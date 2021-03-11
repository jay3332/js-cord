
class CommandContext {
    constructor(message, command, prefix, bot, arguments) {
        this.prefix = prefix;
        this.bot = bot;
        this.command = command;
        this.message = message;
        this.author = message.author;
        this.channel = message.channel;
        this.args = arguments;
    }
    invoke() {
        this.command.exec(this, ...arguments);
    }
};

function parseContext(message, bot) {
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
		else if (prefix instanceof Array)
			return prefix.map(prf => buffer.startsWith(prf)).includes(true)
				? true : NaN;
    }
    return new CommandContext(message);
}