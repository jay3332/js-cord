const Asset = require('./Asset');
const { parseEmoji } = require('../utils');

/**
 * Represents any emoji with minimal information.
 */
module.exports = class PartialEmoji {
    constructor(data) {
        if (typeof data === 'string') {
            data = parseEmoji(data);
        }
        
        /**
         * The ID of this emoji.
         * @type {?string}
         */
        this.id = data.id;

        /**
         * The name of this emoji.
         * @type {string}
         */
        this.name = data.name;

        /**
         * Whether this emoji requires colons.
         * @type {boolean}
         */
        this.requireColons = data.require_colons || true;

        /**
         * Whether or not this emoji is managed.
         * @type {boolean}
         */
        this.managed = data.managed || false;
        
        /**
         * Whether or not this is an animated emoji.
         * @type {boolean}
         */
        this.animated = data.animated ?? false;
        
        /**
         * Whether or not this emoji can be used by the bot.
         * @type {boolean}
         */
        this.available = data.available ?? true;
        
        /**
         * Whether or not this emoji is a raw unicode emoji.
         * @type {boolean}
         */
        this.unicode = !this.id;

        if (this.id) 
            /**
             * The asset this emoji uses.
             * @type {?Asset} 
             */
            this.image = new Asset(`emojis/${this.id}`);
    }

    /**
     * Turns this emoji into one that displays in Discord.
     * @returns {string} The formatted emoji string.
     */
    toString() {
        if (this.unicode) return this.name; 
        let beginning = this.animated ? '<a:' : '<:'
        return `${beginning}${this.name}:${this.id}>`
    }

    /**
     * Turns this emoji into a raw JSON object to be sent to Discord.
     * @returns {object} The raw emoji object.
     */
    toJSON() {
        return {
            name: this.name,
            id: this.id || null,
            animated: this.animated
        }
    }
}