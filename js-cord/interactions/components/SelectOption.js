const PartialEmoji = require('../../models/PartialEmoji');


module.exports = class SelectOption {
    constructor({
        label,
        value,
        description,
        emoji,
        isDefault = false
    } = {}, callback) {
        this.label = label;
        this.value = value;
        this.description = description;

        if (typeof emoji === 'string') 
            emoji = parseEmoji(emoji);

        // if (emoji instanceof Emoji)
        //     emoji = emoji.toPartial();
        
        this._emoji = emoji instanceof PartialEmoji
            ? emoji.toJSON() : emoji;
        
        this.isDefault = isDefault;
        this.callback = callback || (() => {});
    }

    get emoji() {
        return new PartialEmoji(this._emoji);
    }

    static fromJSON(data) {
        let cls = new this({
            label: data.label,
            value: data.value,
            description: data.description,
            emoji: data.emoji,
            isDefault: data['default']
        });
        return cls;
    }

    toJSON() {
        return {
            label: this.label,
            value: this.value,
            'default': this.isDefault,
            emoji: this._emoji,
            description: this.description
        }
    }
}