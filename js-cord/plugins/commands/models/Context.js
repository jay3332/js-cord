module.exports = class Context {
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
    
    get cleanPrefix() {
        return this.prefix.replace(/<@!?([0-9]{17,})>/g, (_, snowflake) => {
            let user = this.bot.getUser(snowflake);
            return user ? '@' + user.displayName : '@invalid-user';
        });
    }
    
    get now() {
        return this.message.createdAt;
    }

    get unix() {
        return this.message.createdAt.getTime()
    }

    async invoke(command, args, flags) {
        return await command.invoke(this, args, flags);
    }

    async reinvoke() {
        return await this.invoke(this, this.args, this.flags);
    }

    async send(content, options) {
        return await this.channel.send(content, options);
    }

    async reply(content, options) {
        return await this.message.reply(content, options);
    }
}