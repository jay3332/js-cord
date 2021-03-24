const Messageable = require("../structures/Messageable");

module.exports = class CommandContext extends Messageable {
    constructor(message, bot, prefix, command, args, invokedWith) {
        super(bot, message.channel.id);
        this.prefix = prefix;
        this.bot = bot;
        this.invokedWith = invokedWith;
        this.subcommand = null; // add when group commands are a thing
        this.command = command;
        this.message = message;
        this.author = message.author;
        this.channel = message.channel;
        this.guild = message.guild;
        this.reply = message.reply;
        this.args = args;
        this.me = message.guild.me;
        this.reference = message.reference;
        this.content = message.content;
    }

}
