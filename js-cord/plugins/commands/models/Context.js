/**
 * Represents the context of a command. 
 * This contains things such as the message, channel, and command the author invoked.
 */
module.exports = class Context {
    /**
     * Context constructor.
     * @param {*} bot
     * @param {Message} message
     */
    constructor(bot, message) {
        this.bot = bot;
        this.message = message;
        this.author = message.author;
        this.channel = message.channel;
        this.guild = message.guild;
        this.me = message.guild?.me;

        this.invokedWith = null;
        this.command = null;
        this.args = {},
        this.flags = {},
        this.prefix = null;
    }
    
    /**
     * The prefix used to invoke the context, escaping mentions.
     * For example <@12345678> becomes @User
     * @returns {string}
     */
    get cleanPrefix() {
        return this.prefix.replace(/<@!?([0-9]{17,})>/g, (_, snowflake) => {
            let user = this.bot.getUser(snowflake);
            return user ? '@' + user.displayName : '@invalid-user';
        });
    }
    
    /**
     * The time the message to invoke the context was created at.
     * @type {Date}
     */
    get now() {
        return this.message.createdAt;
    }

    /**
     * The unix time the message to invoke the context was created at.
     * @type {number} 
     */
    get unix() {
        return this.message.createdAt.getTime()
    }

    /**
     * Invokes a command.
     * @async
     * @param {command} command The command to invoke.
     * @param {Object} args The arguments to provide.
     * @param {Object} flags The flags to provide.
     */
    async invoke(command, args, flags) {
        return await command.invoke(this, args, flags);
    }

    /**
     * Reinvokes the command provided from the original message.
     * @async
     */
    async reinvoke() {
        return await this.invoke(this, this.args, this.flags);
    }

    /**
     * Sends a message to the channel.
     * @async
     * @param {string} content The content to send.
     * @param {Object} options The options to provide.
     * @returns {Promise<Message>}
     */
    async send(content, options) {
        return await this.channel.send(content, options);
    }

    /**
     * Sends an inline reply to the invoked message.
     * @async
     * @param {string} content The content to reply with.
     * @param {Object} options The options to provide.
     * @returns {Promise<Message>}
     */
    async reply(content, options) {
        return await this.message.reply(content, options);
    }
}