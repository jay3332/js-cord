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

    /**
     * Responds to the interaction.
     * @param {string} content The content to send.
     * @param {Object} options The send options.
     * @returns {Message}
     */
    async respond(content, options) {
        return await this.interaction.respond(content, options);
    }

    /**
     * Sends a message (follow-up) to the channel.
     * @param {string} content The content to send.
     * @param {Object} options The send options.
     * @returns {Message}
     */
    async send(content, options) {
        return await this.channel.send(content, options);
    }
}