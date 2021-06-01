const PartialEmoji = require('./PartialEmoji');
const User = require('./User');

/**
 * Represents a reaction on a Discord message.
 */
module.exports = class Reaction {
    constructor(client, message, data) {
        this.client = client;

        /**
         * The emoji of this reaction.
         * @type {?PartialEmoji}
         */
        this.emoji = new PartialEmoji(data.emoji);

        /**
         * The amount of users who reacted with this reaction.
         * @type {?number}
         */
        this.count = data.count;

        /**
         * Whether or not the client has reacted with this reaction.
         * @type {?boolean}
         */
        this.me = data.me;

        /**
         * The message this reaction is from.
         * @type {?Message}
         */
        this.message = message;

        if (this.message) {
            /**
             * The channel this reaction is from.
             * @type {?Channel}
             */
            this.channel = this.message.channel;

            /**
             * The guild this reaction is from.
             * @type {?Guild}
             */
            this.guild = this.message.guild;
        }
    }

    /**
     * Gets the users that reacted with this reaction.
     * @param {?object} options The options to use.
     * @param {?string} options.after Only retrieve reactions after this snowflake.
     * @param {?number} options.limit The maximum amount of reactions to retrieve.
     * @return {Array<User>} The users that reacted.
     */
    async users({ after, limit } = {}) {
        const data = await this.client.http.getReactionUsers(
            this.channel.id, this.message.id, this.emoji, { after, limit });
        
        return data.map(u => new User(this.client, u));
    }
}