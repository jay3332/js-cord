const Asset = require('./Asset');
const { parseEmoji } = require('../utils');

module.exports = class PartialEmoji {
    constructor(data) {
        if (typeof data === 'string') {
            data = parseEmoji(data);
        }
        this.id = data.id;
        this.name = data.name;
        this.requireColons = data.require_colons || true;
        this.managed = data.managed || false;
        this.animated = data.animated ?? false;
        this.available = data.available ?? true;
        this.unicode = !this.id;
        if (this.id) this.image = new Asset(`emojis/${this.id}`);
    }

    toString() {
        if (this.unicode) return this.name; 
        let beginning = this.animated ? '<a:' : '<:'
        return `${beginning}${this.name}:${this.id}>`
    }

    toJSON() {
        return {
            name: this.name,
            id: this.id || null,
            animated: this.animated
        }
    }
}