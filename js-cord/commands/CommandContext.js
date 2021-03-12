const Messageable = require("../structures/Messageable");

class CommandContext extends Messageable {
    constructor(message, bot, prefix, command, args) {
        super(bot, message.channel.id);
        this.prefix = prefix;
        this.bot = bot;
        this.command = command;
        this.message = message;
        this.author = message.author;
        this.channel = message.channel;
        this.guild = message.guild;
        this.reply = message.reply;
        this.args = args;
        this.me = message.guild.me;
        this.reference = message.reference;
    }
    invoke() {
        if (this.author.bot) return;
        this.bot.emit("command", [this]);
        try {
            this.command.exec(this, ...args);
        } catch (error) {
            this.bot.emit("commandError", [this, error]);
        }
        this.bot.emit("commandComplete", [this]);
    }
    static parseContext(message, bot, cls=CommandContext) {

        const prefix = bot.getPrefix(message);
        if (!prefix) return NaN;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
	    let command = args.shift().toLowerCase();

        command = this.bot.getCommand(command);
        if (!command) return NaN;
        const execParams = command.execParams;
        return new cls(message, bot, prefix, command, args);
    }
};

module.exports = CommandContext;