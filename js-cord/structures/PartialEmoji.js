const { parseSnowflake, parseAssetSize } = require("../util/Util");

// was supposed to be extended by Emoji, but some things are different here (e.g. this can also take Unicode emojis)
module.exports = class PartialEmoji {
    constructor(client, data) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        this.animated = data.animated || false;
        if (this.id) this.createdAt = parseSnowflake(this.id);
        this.custom = (!!this.id);
    }
    get defaultFormat() {
        return this.animated ? "gif" : "png";
    }
    get url() {
        return this.urlAs({ format: this.defaultFormat });
    }
    urlAs({ format, size }) {

        if (!this.custom) return undefined;
        let url = `https://cdn.discordapp.com/emojis/${this.id}.`;
        
        format = format               ? format.toLowerCase() : this.defaultFormat;
        size   = parseAssetSize(size) ? `?size=${size}`      : "";
        
        let validFormats = [ "png" ];
        if (this.animated) validFormats.push("gif");
        if (!validFormats.includes(format)) format = this.defaultFormat; 

        return url + format + size;
    }
    toString() {
        if (!this.custom) return this.name;
        let anim = this.animated ? "a" : "";
        return `<${anim}:${this.name}:${this.id}>`;
    }
    get requestEmoji() {
        if (!this.custom) return this.name;
        return `${this.name}:${this.id}`
    }
}