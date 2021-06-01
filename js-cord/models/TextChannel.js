const GuildChannel = require('./GuildChannel');
const MessageBuilder = require('./MessageBuilder');

/**
 * Represents a text channel in a guild.
 * @extends GuildChannel
 */
module.exports = class TextChannel extends GuildChannel {
    constructor(client, data) {
        super(client, data);
        if (data) this.loadData(data);
    } 

    loadData(data) {
        /**
         * The channel topic of this channel.
         * @type {?string}
         */
        this.topic = data.topic;

        /**
         * Whether or not this channel is marked as NSFW.
         * @type {boolean}
         */
        this.nsfw = data.nsfw;

        /**
         * The last message sent in this channel, if any.
         * @type {?Message}
         */
        this.lastMessage = this.getMessage(data.last_message_id);
    }

    /**
     * Tries to get a message from the internal cache via ID.
     * @param {string} id The ID of the message.
     * @returns {?Message} The found message, if any.
     */
    getMessage(id) {
        let cache = this.client.cache.messages;
        return cache.find(msg => msg.channel.id == this.id && msg.id == id);
    }

    /**
     * Sends a message in this channel.
     * @param {?string} content The contents of the message to send. 
     * @param {?object} options The options to pass into the {@link MessageBuilder}. 
     * @returns {?Message} The message, if successfully sent.
     */
    async send(content, options) {
        let builder = new MessageBuilder(this, content, options, 'send');
        return await builder.build().send();
    }

    async *collectMessages({ limit, timeout, check } = {}) {
        check = check || (() => true);
        const actual = (message) => {
            return check(message) && message.channel.id === this.id; 
        }

        for await (let message of this.client.collect('message', { limit, timeout, actual })) {
            yield message;
        }
    }

    async waitForMessage({ timeout, check } = {}) {
        for await (let message of this.collectMessages({ limit: 1, timeout, check })) {
            return message;
        }
    }
}