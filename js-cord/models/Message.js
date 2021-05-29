const DiscordObject = require('./DiscordObject');
const MessageBuilder = require('./MessageBuilder');
const User = require('./User');
const Member = require('./Member');

/**
 * Represents a Discord message.
 */
module.exports = class Message extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        /**
         * The user or member that sent this message.
         * @type {Member | User} 
         */
        this.author = null;

        if (data.author || data.member) this.author = data.member 
            ? new Member(this.client, null, (
                data.member.user 
                    ? data.member
                    : { ...data.member, user: data.author } 
            )) 
            : new User(this.client, data.author);

        /**
         * Whether or not this message had TTS enabled.
         * @type {boolean}
         */
        this.tts = data.tts;
        
        /**
         * The raw text content of the message.
         * @type {string}
         */
        this.content = data.content;

        /**
         * Whether or not this message mentioned everyone.
         * @type {boolean}
         */
        this.mentionsEveryone = data.mention_everyone;

        /**
         * Whether or not this message is pinned.
         * Only valid for messages sent in {@link TextChannel}s.
         * @type {?boolean}
         */
        this.pinned = data.pinned;

        /**
         * The type enumeration of the message.
         * @see enums.MessageType
         * @type {number}
         */
        this.type = data.type;

        if (data.edited_timestamp)
            /**
             * The last time this message was edited.
             * @type {?Date}
             */
            this.editedAt = new Date(Date.parse(data.edited_timestamp));

        /**
         * The channel that this message was sent in.
         * @type {TextChannel | DMChannel}
         */
        this.channel = this.client.getChannel(data.channel_id);

        if (data.guild_id) 
            /**
             * The guild that this message was sent in, if any.
             * @type {?Guild}
             */
            this.guild = this.client.getGuild(data.guild_id);

        this._components = data.components;
    }

    toString() {
        return this.content;
    }

    /**
     * Edits this message.
     * @param {string} content The new contents of the message.
     * @param {object} options The options to pass into the {@link MessageBuilder}.
     * @returns {Message} The updated {@link Message} object.
     */
    async edit(content, options) {
        let builder = new MessageBuilder(this.channel, content, options, 'edit', this.id);
        return await builder.build().send();
    } 

    /**
     * Replies to this message.
     * @param {string} content The contents of the message.
     * @param {object} options The options to pass into the {@link MessageBuilder}.
     * @returns {Message} The sent {@link Message}.
     */
    async reply(content, options) {
        options.reference = this.id;
        return await this.channel.send(content, options);
    }
}
