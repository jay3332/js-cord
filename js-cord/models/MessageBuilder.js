const Embed = require('./Embed');
const { InteractionResponseType } = require('../enums');


module.exports = class MessageBuilder {
    constructor(destination, content, options = {}, type = 'send', ...extra) {
        if (typeof content === 'object') {
            options = content;
            content = undefined;
        }    
        options.content = options.content || content;

        this.extra = extra;
        this.client = destination.client;
        this.destinationID = destination.id;
        this.referenceID = options.reference?.id;
        this.options = options;
        this.context = {};
        this.payload = {};
        this.files = [];
        this.type = type;
    }

    build() {
        this.resolveBasic();
        this.resolveContent();
        this.resolveEmbeds();
        return this
    }

    resolveBasic() {
        let tts = this.options.tts || false;
        this.payload.tts = tts;

        if (this.options.reference) 
            this.payload.message_reference = {
                message_id: this.options.reference
            };

        if (this.options.ephemeral && this.type === 'interaction') {
            this.payload.flags = 64;
        }

        if (this.type === 'interaction') {
            const defer = this.options.defer || false;
            if (this.options.edit) {
                this.context.type = defer 
                    ? InteractionResponseType.deferredMessageEdit
                    : InteractionResponseType.messageEdit;
            } else if (this.options.pong) {
                this.context.type = InteractionResponseType.pong;
            } else {
                this.context.type = defer
                    ? InteractionResponseType.deferredChannelMessage
                    : InteractionResponseType.channelMessage;
            }
        }

        if (this.options.type && this.type === 'interaction') {
            this.context.type = this.options.type;
        } else {
            // If no type was provided just make it send a new message
            this.context.type === InteractionResponseType.channelMessage;
        }

        let mentions;
        if (mentions = (this.options.allowedMentions || this.client.allowedMentions)) {
            if (mentions.replies) mentions.replied_user = mentions.replies;
            if (mentions.repliedUser) mentions.replied_user = mentions.repliedUser;
            this.payload.allowed_mentions = mentions;
        }

        if (this.options.components) {
            this.payload.components = this.options.components.toJSON();
            this.options.components.components.forEach(component => {
                // This is an action row.
                const components = component.components;
                // Only store components with a callback
                this.client._components.push(...components.filter(c => c.id && c.callback));
            })
        }

        return this
    }
    
    resolveContent() {
        let content = this.options.content;
        let code = this.options.code;

        if (typeof code === 'string') {
            content = '```' + code + '\n' + content + '```';
        }

        this.payload.content = content;
        return this
    }

    resolveEmbeds() {
        if (!(this.options.embed || this.options.embeds))
            return;

        if (this.type === 'webhook') {
            if (this.options.embed) {
                this.options.embeds = [this.options.embed];
            }
            if (this.options.embeds.some(embed => !embed instanceof Embed))
                throw new TypeError('Embeds must be an Embed object.');
            this.options.embeds.forEach(embed => {
                if (embed.files.length) {
                    if (!this.options.files) 
                        this.options.files = [];
                    this.options.files.push(...embed.files);
                    delete embed.files;
                }
            })
            this.payload.embeds = this.options.embeds.map(embed => embed.toJSON());
            return
        }

        if (!this.options.embed instanceof Embed) 
            throw new TypeError('Embed must be an Embed object.');

        if (this.options.embed.files.length) {
            if (!this.options.files) 
                this.options.files = [];
            this.options.files.push(this.options.embed.file);
            delete this.options.embed.files;
        }
        this.payload.embed = this.options.embed.toJSON();
        return this
    }

    async send() {
        let message;
        const Message = require('./Message');

        switch (this.type) {
        case 'send': 
            message = await this.client.http
                .createMessage(this.destinationID, this.payload);
            return new Message(this.client, message);
        case 'edit':
            message = await this.client.http
                .editMessage(this.destinationID, this.extra[0], this.payload);
            return new Message(this.client, message);
        case 'interaction': 
            message = await this.client.http
                .respondToInteraction(...this.extra, this.context.type, this.payload);
            if (message) return new Message(this.client, message);
        }
    }
}
