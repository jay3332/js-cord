module.exports = class SlashContext {
    constructor(interaction, command) {
        this.interaction = interaction;
        this.command = command;

        this.options = interaction.data.options;
        this.author = interaction.author;
        this.message = interaction.message;
        this.channel = interaction.channel;
        this.guild = interaction.guild;
        this.me = this.guild.me;
    }

    async respond(content, options) {
        return await this.interaction.respond(content, options);
    }

    async send(content, options) {
        return await this.channel.send(content, options);
    }
}