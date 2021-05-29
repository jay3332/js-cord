const DiscordObject = require('./DiscordObject');
const MessageBuilder = require('./MessageBuilder');
const Message = require('./Message');
const Member = require('./Member');
const User = require('./User');
const Role = require('./Role');

module.exports = class Interaction extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        /**
         * The interaction token to send to Discord.
         * @type {string}
         */
        this.token = data.token;

        /**
         * This is always 1.
         * @type {integer}
         */
        this.version = data.version;  // Always 1

        /**
         * The ID of the application (user) that received the interaction.
         * This is usually always your bot's ID.
         * @type {string} 
         */
        this.applicationID = data.application_id;

        /**
         * The type of interaction this is.
         * @see enums.InteractionType
         * @type {integer}
         */
        this.type = data.type;
        
        this._data = data.data;

        if (this._data) {      
            let buffer;

            /**
             * The interaction data, such as the options provided in the interaction.
             * @type {?object}
             */
            this.data = {
                id: this._data.id,
                name: this._data.name
            }

            if (buffer = this._data.custom_id)
                this.data.customID = buffer;
            if (buffer = this._data.component_type)
                this.data.type = buffer;

            if (buffer = this._data.resolved) {
                if (buffer.users)
                    this.data.users = Object.values(buffer.users)
                        .map(user => {
                            if (!user) return;
                            const obj = new User(this.client, user);
                            this.client.cache.users.push(obj);
                            return obj;
                        }).filter(u => u);

                if (buffer.members)
                    this.data.members = Object.entries(buffer.members)
                        .map(([ id, member ]) => {
                            if (!member) return;
                            member.user = this.data.users.find(u => u.id === id);
                            const obj = new Member(this.client, this.guild, member);
                            this.client.cache.users.push(obj.toUser());
                            return obj;
                        }).filter(m => m);

                if (buffer.roles)
                    this.data.roles = Object.values(buffer.roles)
                        .map(role => {
                            if (!role) return;
                            const obj = new Role(this.client, this.guild, role);
                            this.client.cache.roles.push(obj);
                            return obj;
                        }).filter(r => r);

                if (buffer.channels)
                    this.data.channels = Object.entries(buffer.channels)
                        .map(([ id, channel ]) => {
                            if (!channel) return;
                            return this.client.cache.getChannel(id);
                        }).filter(c => c);
            }

            if (buffer = this._data.options) {
                this.data.options = {};
                for (let { name, value } of buffer) {
                    this.data.options[name] = value;
                }
            }
        }

        if (data.channel_id)
            /**
             * The channel this interaction was sent in.
             * @type {?TextChannel | DMChannel}
             */
            this.channel = this.client.getChannel(data.channel_id);
        if (data.guild_id)
            /**
             * The guild this interaction was sent in.
             * @type {?Guild}
             */
            this.guild = this.client.getGuild(data.guild_id);

        if (data.message) {
            const obj = new Message(this.client, data.message);
            this.client.cache.messages.push(obj);

            /**
             * The interaction message.
             * @type {Message}
             */
            this.message = obj;
        }

        if (data.member) {
            const obj = new Member(this.client, this.guild, data.member);
            this.client.cache.users.push(obj.toUser());

            /**
             * The user that made this interaction.
             * @type {User | Member}
             */
            this.author = obj;
        } else if (data.user) {
            const obj = new User(this.client, data.user);
            this.client.cache.users.push(obj);
            this.author = obj;
        }
    }

    async send(content, options) {
        return await this.respond(content, options);
    }

    async edit(content, options) {
        return await this.respond(content, options, { edit: true });
    }

    /**
     * Responds to the interaction.
     * @param {?string} content The content of the message.
     * @param {?options} options The options to pass into the {@link MessageBuilder}. 
     * @returns {?Message} The message sent, if there was one.
     */
    async respond(content, options, __overwrites = {}) {
        const builder = new MessageBuilder(
            this.channel, 
            content, 
            options, 
            'interaction', 
            this.id, 
            this.token 
        );
        builder.options = { ...builder.options, ...__overwrites };
        return await builder.build().send();
    }
}