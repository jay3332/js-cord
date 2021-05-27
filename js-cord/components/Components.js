const ActionRow = require('./ActionRow');
const Button = require('./Button');

module.exports = class Components {
    constructor() {
        this.components = [];
        this._buffer = null;
    }

    addRow(...components) {
        if (components.length === 1 && components[0] instanceof Array) {
            components = components[0];
        }

        const row = new ActionRow(components);
        this.components.push(row);
        this._buffer = row;
        return this;
    }

    addComponent(component) {
        if (!this._buffer) {
            this.addRow();
        } else if (this._buffer.length >= 5) {
            this.addRow();  // Max component length is 5
        }

        this._buffer.addComponent(component);
        return this
    }

    addButton({ style, label, emoji, id, url, disabled } = {}, callback) {
        return this.addComponent(new Button({ style, label, emoji, id, url, disabled }, callback));
    }

    toJSON() {
        return this.components.map(c => c.toJSON());
    }
}