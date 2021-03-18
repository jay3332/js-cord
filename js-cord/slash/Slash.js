module.exports = class Slash {
    constructor(client) {
        this.client = client;
    }

    /**
     * Adds an execution function for when a slash command is received by the client.
     * @param command - The command name of the slash command.
     * @param exec - A function, which will be executed when the client receives the slash command. This function should have one argument, which will be a {@link SlashContext} structure.
     * @example ```js
     * const discord = require('js-cord');
     * const client = new discord.Client({ slash: true });
     * 
     * client.slash.createCommand({
     *     name: "slash",
     *     description: "A normal slash command",
     *     guild: slashClient.getGuild("123456789012345678"),
     *     args: [
     *        {}
     *     ]
     * })
     * 
     * client.login('TOKEN');
     */

    onCommand(command, exec) {
        this.client.addListener("slashCommandUsed", ctx => {
            if (ctx.command.id === command.id) {
                Promise.resolve(exec(ctx));
            }
        });
    }

    async getCommand(id, guild) {
        if (typeof guild === "number" || typeof guild === 'string') {
            guild = this.client.getGuild(guild.toString());
        }
        
    }

    async createCommand(options, guild) {
        if (typeof guild === "number" || typeof guild === 'string') {
            guild = this.client.getGuild(guild.toString());
        }
    }

    async deleteCommand(options, guild) {
        if (typeof guild === "number" || typeof guild === 'string') {
            guild = this.client.getGuild(guild.toString());
        }
    }

    async allCommands(guild) {
        if (typeof guild === 'number' || typeof guild === 'string') {
            guild = this.client.getGuild(guild.toString());
        }
        
        return !guild ? (await this.client.http.getGlobalSlashCommands(this.client.user.id)) 
                      : (await this.client.http.getGuildSlashCommands(this.client.user.id, guild));
    }
}