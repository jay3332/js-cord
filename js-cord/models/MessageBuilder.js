const Embed = require('./Embed');
const Message = require('./Message');


module.exports = class MessageBuilder {
    constructor(destination, content, options = {}, type = 'send') {
        if (typeof content === 'object') {
            options = content;
            content = undefined;
        }    
        options.content = options.content || content;
        this.client = destination.client;
        this.destinationID = destination.id;
        this.referenceID = options.reference?.id;
        this.options = options;
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
            this.payload.embeds = this.options.embeds.map(embed => embed.toJSON());
            return
        }

        if (!this.options.embed instanceof Embed) 
            throw new TypeError('Embed must be an Embed object.');
        this.payload.embed = this.options.embed.toJSON();
        return this
    }

    async send() {
        let message = await this.client.http.createMessage(this.destinationID, this.payload);
        return new Message(this.client, message);
    }
}
