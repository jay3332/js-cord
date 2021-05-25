const Asset = require('./Asset');

module.exports = class PartialEmoji {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.requireColons = data.require_colons;
        this.managed = data.managed;
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
}