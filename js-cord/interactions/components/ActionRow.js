const Component = require('./Component');

/**
 * Represents a row of components.
 */
module.exports = class ActionRow extends Component {
    constructor(components = []) {
        super(1);
        
        /**
         * An array of components this row has.
         * @type {Component[]} 
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
     * A JSON object representing this row.
     * @returns {object} The data to send to Discord.
     */
    toJSON() {
        const arr = this.components.map(c => c.toJSON());
        return { type: this.type, components: arr };
    }

    /**
     * Return the number of components this row has.
     * @type {number} The amount of components.
     */
    get length() {
        return this.components.length
    }
}