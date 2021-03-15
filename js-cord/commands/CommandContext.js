const Messageable = require("../structures/Messageable");
const { GuildOnlyError, CheckError, PermissionError } = require("../errors/DiscordEventError");

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
        this.content = message.content;
    }
    invoke() {
        // if (this.author.bot) return;
        
        this.bot.emit("command", [this]);
        try {
            // check guild-only
            if (this.command.guildOnly && !!this.guild) 
                throw new GuildOnlyError("This command is marked guild-only and cannot be used in DMs.");
            // check permissions + checks (will come later)

            this.command.exec(this, ...args);
        } catch (error) {
            this.bot.emit("commandError", [this, error]);
        }
        this.bot.emit("commandComplete", [this]);
    }
    static parseContext(message, bot, cls=CommandContext) {
        /**
         * Parses a message into CommandContext.
         * A custom context class can be specified.
         * 
         * Takes the message content, and detects a prefix.
         * If no prefix is detected, it returns NaN
         * 
         * It will then parse the command itself.
         * Prioritizing the whole command first, we will iterate through, splitted by spaces.
         * 
         * Example input:
         * !command arg1 arg2 some text which is consume-all
         * New array of args: 
         * ['command', 'arg1', 'arg2', 'some', 'text', 'which', 'is', 'consume-all']
         * 
         * -- Getting the command --
         * We will now iterate from the back of the list -
         * until a valid command is reached. If no command is found, return NaN
         * Now, just replace the command. It should return the list of RAW arguments.
         * 
         * -- Argument parsing --
         * Arguments that aren't consume all can have spaces if they are surrounded in quotes.
         * Example of raw arguments: ['hi', '"this', 'has', 'spaces"', 'consume', 'all']
         * Example of parsed arguments: ['hi', 'this has spaces', 'consume all']
         */

        const prefix = bot.getPrefix(message);
        if (!prefix) return NaN;

        const noPrefix = message.content.slice(prefix.length).trim();
        const args = noPrefix.split(/[\s\n]+/);
        let _ = args.length;

        let buffer = null;
        let command = null;
        let maybeCommand = null;
        for (let i = args.length; i>0; i--) {
            buffer = args.slice(0, i-1).join(' ');
            maybeCommand = this.bot.getCommand(buffer);
            if (!!maybeCommand) {
                command = maybeCommand;
                break;  
        }}

        if (!command) return NaN;
        let pointer = 0;
        let parsedArgs = [];
        let temp = "";

        let signaturePointer = 0;
        let signature = command.execParams.slice(1);
        let isParsingQuote = false;

        _ = noPrefix.replace(buffer, "").trim();
        for (char of _) {
            if (!signature[signaturePointer]) break;
            if (signature[signaturePointer].contains("...")) {
                parsedArgs.push(_.slice(pointer));
                break;
            }
            if (!isParsingQuote) {
                if (char === "\"") {
                    if (!!_[pointer-1]) {
                        if (_[pointer-1] !== "\\") {
                            isParsingQuote = true;
                }}};
                if (!isParsingQuote) {
                    if (!char.match(/[\s\n]/).length) {
                        // it's a part of the argument, continue.
                        temp += char;
                    } else {
                        // we need to increment the counter, since it's a space
                        parsedArgs.push(temp); temp="";
                        signaturePointer++;
                    }
                }
            } else {
                if (char === "\"" && _[pointer-1] !== "\\") {
                    isParsingQuote = false; parsedArgs.push(temp); temp="";
                    signaturePointer++;
                } else {
                    temp += char;
                }
            }
            pointer++;
        }

        return new cls(message, bot, prefix, command, parsedArgs);

        /*command = this.bot.getCommand(command);
        if (!command) return NaN;
        const execParams = command.execParams;
        return new cls(message, bot, prefix, command, args);*/
    }
};

module.exports = CommandContext;