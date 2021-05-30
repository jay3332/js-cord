const Component = require('./Component');
const { COMPONENT_WIDTHS } = require('../../constants');

/**
 * Represents a row of components.
 */
module.exports = class ActionRow extends Component {
    constructor(components = []) {
        super(1);
        
        /**
         * An array of components this row has.
         * @type {Array<Component>} 
         */
        this.components = components;
    }

    /**
     * Adds a component to this row.
     * @param {Component} component 
     */
    addComponent(component) {
        this.components.push(component);
        return this;
    }

    /**
     * Turns this row into raw JSON data to be sent to Discord.
     * @returns {object} The data to send to Discord.
     */
    toJSON() {
        const arr = this.components.map(c => c.toJSON());
        return { type: this.type, components: arr };
    }

    /**
     * Returns the length of this row.
     * @see {@link constants.COMPONENT_WIDTHS}
     * @returns {number} The amount of components.
     */
    get length() {
        let buffer = 0;
        for (const component of this.components) {
            if (Object.keys(COMPONENT_WIDTHS).includes(component.constructor.name)) {
                buffer += COMPONENT_WIDTHS[component.constructor.name]
            }
        }
        return buffer;
    }

    canAdd(component) {
        return (this.length + COMPONENT_WIDTHS[component.constructor.name]) <= 5;
    }
}