const ActionRow = require('./ActionRow');
const Button = require('./Button');

/**
 * Represents the entire components of a message.
 */
module.exports = class Components {
    constructor({
        __components = [],
        __buffer = null
    } = {}) {
        this._components = __components;
        this._buffer = __buffer;
    }

    /**
     * Returns a copy of this instance.
     * @returns {Components} The copy.
     */
    copy() {
        return new this.constructor({
            __components: this._components,
            __buffer: this._buffer
        });
    }

    /**
     * Adds an {@link ActionRow} to the components.
     * @param  {...Component} components The components to add to the row.
     */
    addRow(...components) {
        if (components.length === 1 && components[0] instanceof Array) {
            components = components[0];
        }

        const row = new ActionRow(components);
        this._components.push(row);
        this._buffer = row;
        return this;
    }

    /**
     * Adds a component while automatically wrapping.
     * @param {Component} component The component to add.
     */
    addComponent(component) {
        if (!this._buffer) {
            this.addRow();
        } else if (!this._buffer.canAdd(component)) {
            this.addRow();
        }

        this._buffer.addComponent(component);
        return this;
    }

    /**
     * Implicity constructs and adds a button to the components.
     * @param {?object} options The options to pass into the button constructor. 
     * @param {?function} callback The interaction callback for when the button is pressed. 
     */
    addButton({ style, label, emoji, id, url, disabled } = {}, callback) {
        return this.addComponent(new Button({ style, label, emoji, id, url, disabled }, callback));
    }

    /**
     * Iterates over all of the components.
     * {@link ActionRow}s are not included here. 
     * @yields {?Component}
     */
    *components() {
        for (let component in this._components) {
            yield* component.components;
        }
    }

    /**
     * Returns the visible component at a certain index.
     * @param {number} index The index to view.
     * @returns {?Component} The component at the given index, if any.
     */
    componentAt(index) {
        let idx = 0;
        for (let component in this.components()) {
            if (idx++ === index) return component;
        }
    }

    /**
     * If a button is located at this index, disable it.
     * @param {...number} indices The indices of the buttons to disable.
     * @return {?Button} The button disabled, if any. 
     * If more than one button was provided, this returns an array instead.
     */
    disableButtonAt(...indices) {
        let success = [];
        for (let idx in indices) {
            let button = this.componentAt(idx);
            if (button instanceof Button) {
                button.disabled = true;
                success.push(button)
            }
        }

        return success.length <= 0 
            ? undefined : (
                success.length === 1 ? success[0] : success
            );
    }

    /**
     * The amount of components, excluding {@link ActionRow}s.
     * @type {number}
     */
    get length() {
        return [...this.components()].length;
    }

    /**
     * Turns this into a JSON object.
     * @returns {object} The raw JSON data.
     */
    toJSON() {
        return this._components.map(c => c.toJSON());
    }
}