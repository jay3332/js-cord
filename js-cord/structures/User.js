const {parseSnowflake, parseAssetSize} = require('../util/Util');

class User {
    constructor(client, data) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        this.discriminator = data.discriminator;
        this.mention = `<@!${this.id}>`;
        this.bot = data.bot;
        this.avatar = data.avatar;
    }
    get tag() { return `${this.name}#${this.discriminator}` }
    toString() { return this.tag }

    get avatarAnimated() { return !this.avatar ? undefined : this.avatar.startsWith("a_") }
    get defaultFormat() { return this.avatarAnimated ? "gif" : "png" }
    get avatarUrl() { return this.avatarUrlAs({ format: this.defaultFormat }) } 
    avatarUrlAs({ format, size }) {
        if (!this.avatar) return undefined;

        let url = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.`;
        
        format = format               ? format.toLowerCase() : this.defaultFormat;
        size   = parseAssetSize(size) ? `?size=${size}`      : "";
        
        let validFormats = ["png", "jpeg", "jpg", "webp"];
        if (this.avatarAnimated) validFormats.push("gif");
        if (!validFormats.includes(format)) format = this.defaultFormat; 
        if (format === "jpeg") format = "jpg";

        return url + format + size;
    }
}/*
        this.dmChannel = null;
        this.client = client;
        this.input_id = user_id;
        data = (!data) ? client.http.getUserInformation(user_id) : data;
        this.parseData(data);
    }
    parseData(data) {
        const client = this.client;
        const user_id = this.input_id;
        this.id = data['id'];
        this.name = data['username'];
        this.mention = `<@!${user_id}>`;
        this.discriminator = data['discriminator'];
        this.avatarHash = data['avatar'];
        try { 
            this.avatarAnimated = this.avatarHash.startsWith("a_");
        } catch(err) {
            this.avatarAnimated = false;
        }
        const defaultFormat = this.avatarAnimated ? "gif" : "png";
        this.avatarUrl = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatarHash}.${defaultFormat}`;

        this.bot = data['bot'];
        this.tag = `${this.name}#${this.discriminator}`;
        try { this.createdAt = parseSnowflake(this.id); } 
        catch (err) { this.createdAt = null; }
        this.flagValue = data['flags'];
        this.premiumType = data['premium_type'];
        this.publicFlagValue = data['public_flags'];        
    } 
    static fromData(client, data) {
        return new User(client, data['id'], data);
    }
    toString() {
        return this.tag;
    }
    avatarUrlAs(options = {}) {
        let url = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatarHash}`
        let validFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

        if (
            options.format &&
            typeof options.format === 'string' &&
            validFormats.includes(options.format.toLowerCase())
        ) {
            let format = options.format;
            if (!this.avatarAnimated && options.format.toLowerCase() === 'gif')
                format = (options.fallback &&
                validFormats.includes(options.fallback.toLowerCase()))
                    ? options.fallback.toLowerCase()
                    : 'webp'
            url += `.${format}`
        }
        else url += '.webp'

        if (
            options.size &&
            parseAssetSize(options.size)
        ) url += `?size=${options.size}`

        return url;
    }

    openDM() {
        const Channel = require('../structures/Channel');
        const channelData = this.client.http.openUserDM();
        this.dmChannel = new Channel(this.client, channelData['id'], this);
    }
    
    send(...args) {
        if (!this.dmChannel) {
            this.openDM();
        }
        this.dmChannel.send(...args);
    }
}

module.exports = User;*/