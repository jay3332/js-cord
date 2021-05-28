const Component = require('./Component');
const { ButtonStyle } = require('../../enums');
const { parseEmoji, urandom } = require('../../utils');
const PartialEmoji = require('../../models/PartialEmoji');
// const Emoji = require('../models/Emoji');

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
        this.style = style;
        this.label = label;
        this.url = url;
        this.disabled = disabled;
        this.callback = callback;

        if (typeof emoji === 'string') 
            emoji = parseEmoji(emoji);

        // if (emoji instanceof Emoji)
        //     emoji = emoji.toPartial();
        
        this._emoji = emoji instanceof PartialEmoji
            ? emoji.toJSON() : emoji;
    }

    get emoji() {
        return new PartialEmoji(this._emoji);
    }

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