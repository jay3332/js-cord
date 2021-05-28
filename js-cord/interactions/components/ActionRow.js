const Component = require('./Component');

module.exports = class ActionRow extends Component {
    constructor(components = []) {
        super(1);
        this.components = components;
    }

    /**
     * Add an component to the row
     * @param {Component} component 
     */
    addComponent(component) {
        this.components.push(component);
    }

    toJSON() {
        const arr = this.components.map(c => c.toJSON());
        return { type: this.type, components: arr };
    }
    /**
     * Return the length of the row
     * @returns {number} 
     */
    get length() {
        return this.components.length
    }
}