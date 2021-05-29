const Component = require('./Component');

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
     * Return the number of components this row has.
     * @returns {number} The amount of components.
     */
    get length() {
        return this.components.length
    }
}