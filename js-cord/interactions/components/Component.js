module.exports = class Component {
    constructor(type, customID) {
        this.type = type;
        this.id = customID;
    }

    /**
     * Returns the id of the component
     * @returns {string}
     */
    get customID() {
        return this.id;
    }
    /**
     * Make a component from an `JSON`
     * @param {JSON} data The raw Object
     * @returns {Component} The component made from the raw data.
     * 
     */
    static fromJSON(data) {
        return new this(data.type, data.custom_id);
    }
    /**
     * @returns {JSON} Returns a JSON object with the type and custom_id keys
     */
    toJSON() {
        return {
            type: this.type,
            custom_id: this.id
        }
    }
}