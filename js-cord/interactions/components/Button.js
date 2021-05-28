const Component = require('./Component');
const { ButtonStyle } = require('../../enums');
const { parseEmoji, urandom } = require('../../utils');
const PartialEmoji = require('../../models/PartialEmoji');
// const Emoji = require('../models/Emoji');

/**
 * Represents a button component.
 */
module.exports = class Button extends Component {
    constructor({
        style = ButtonStyle.primary,
        label,
        emoji,
        id,
        url, 
        disabled = false
    } = {}, callback) {
        if (style !== ButtonStyle.link && !id) {
            id = urandom(32).toString(16); 
        }
    
        super(2, id);

        /**
         * The style of this button.
         * @see enums.ButtonStyle
         * @type {number}
         */
        this.style = style;

        /**
         * The raw text/label displayed in this button.
         * @type {string}
         */
        this.label = label;

        /**
         * The URL that this button directs to.
         * Only valid for link buttons.
         * @type {?string}
         */
        this.url = url;

        /**
         * Whether or not the button is disabled.
         * @type {boolean}
         */
        this.disabled = disabled;

        /**
         * The callback for when the button is pressed.
         * @type {?function}
         */
        this.callback = callback;

        if (typeof emoji === 'string') 
            emoji = parseEmoji(emoji);

        // if (emoji instanceof Emoji)
        //     emoji = emoji.toPartial();
        
        this._emoji = emoji instanceof PartialEmoji
            ? emoji.toJSON() : emoji;
    }

    /**
     * The emoji the button has, if any.
     * @type {?PartialEmoji}
     */
    get emoji() {
        return new PartialEmoji(this._emoji);
    }

    /**
     * Turns this button into Discord payload data.
     * @returns {object} The JSON object.
     */
    toJSON() {
        return {
            type: this.type,
            style: this.style,
            label: this.label,
            emoji: this._emoji,
            custom_id: this.id,
            url: this.url,
            disabled: this.disabled || false
        }
    }

    /**
     * Stops your button from being interacted with.
     * In reality, this just sets it's callback to nothing.
     */
    stop() {
        this.callback = () => {};
        return this;
    }
}