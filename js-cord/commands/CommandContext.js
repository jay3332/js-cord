const Messageable = require("../structures/Messageable");
const { GuildOnlyError, CheckError, PermissionError } = require("../errors/DiscordEventError");
const parseArgs =require("../commands/ArgumentParser");

class CommandContext extends Messageable {
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
        // this.guild = message.guild;
        this.reply = message.reply;
        this.args = args;
        // this.me = message.guild.me;
        // this.reference = message.reference;
        this.content = message.content;
    }
    async invoke(command=null) {
        // if (this.author.bot) return;
        
        if (!!command) {
            this.command = command;
        }

        await this.bot.emit("command", [this]);
        try {
            // check guild-only
            //if (this.command.guildOnly && !!this.guild) 
            //    throw new GuildOnlyError("This command is marked guild-only and cannot be used in DMs.");
            // check permissions + checks (will come later)

            await this.command.exec(this, this.args);
        } catch (error) {
            try { await this.command.onError(this, error); }
            catch (err) { await this.bot.emit("commandError", [this, err]) }
        }
        await this.bot.emit("commandComplete", [this]);
    }
    async static parseContext(message, bot, cls=CommandContext) {
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

        const prefix = await bot.getPrefix(message);
        if (!prefix) return NaN;

        const noPrefix = message.content.slice(prefix.length).trim();
        const args = noPrefix.split(/[\s\n]+/);
        let _ = args.length;

        //console.log(prefix, noPrefix, args);
        let buffer = null;
        let command = null;
        let maybeCommand = null;
        let invokedWith = null;
        for (let i = args.length; i>0; i--) {
            buffer = args.slice(0, i).join(' ');
            maybeCommand = bot.getCommand(buffer);
            //console.log(buffer, maybeCommand);
            if (!!maybeCommand) {
                invokedWith = buffer;
                command = maybeCommand;
                break;  
        }}

        //console.log(command);
        if (!command) return NaN;
        _ = noPrefix.replace(buffer, "").trim();
        const partialContext = new cls(message, bot, prefix, command, undefined, invokedWith);
        
        try {
            const parsedArgs = parseArgs(partialContext, _);
        } catch (error) {
            try { await command.onError(partialContext, error); }
            catch (err) { await bot.emit("commandError", [partialContext, err]) }
        }
        
        return new cls(message, bot, prefix, command, parsedArgs, invokedWith);

        /*command = this.bot.getCommand(command);
        if (!command) return NaN;
        const execParams = command.execParams;
        return new cls(message, bot, prefix, command, args);*/
    }
};

module.exports = CommandContext;