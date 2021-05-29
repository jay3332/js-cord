const ActionRow = require('./ActionRow');
const Button = require('./Button');

module.exports = class Components {
    constructor({
        __components = [],
        __buffer = null
    } = {}) {
        this.components = __components;
        this._buffer = __buffer;
    }

    /**
     * Returns a deep copy of this object.
     * @returns {Components}
     */
    copy() {
        return new this.constructor({
            __components: this.components,
            __buffer: this._buffer
        });
    }

    /**
     * Adds an ActionRow to this object.
     * @param {...Component} components The components in the row.
     * @returns {Components}
     */
    addRow(...components) {
        if (components.length === 1 && components[0] instanceof Array) {
            components = components[0];
        }

        const row = new ActionRow(components);
        this.components.push(row);
        this._buffer = row;
        return this;
    }

    /**
     * Adds a component.
     * @param {Component} component The component to add.
     * @returns {Components}
     */
    addComponent(component) {
        if (!this._buffer) {
            this.addRow();
        } else if (this._buffer.length >= 5) {
            this.addRow();  // Max component length is 5
        }

        this._buffer.addComponent(component);
        return this;
    }

    /**
     * Adds a button.
     * @param {Object} options The options to provide.
     * @param {?function} callback The function to call when the interaction is recieved.
     * @returns 
     */
    addButton({ style, label, emoji, id, url, disabled } = {}, callback) {
        return this.addComponent(new Button({ style, label, emoji, id, url, disabled }, callback));
    }

    /**
     * Returns the JSON object representing this class. (to be provided to Discord)
     * @returns {Object[]}
     */
    toJSON() {
        return this.components.map(c => c.toJSON());
    }
}