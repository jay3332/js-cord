/**
 * The base class that represents a Discord message component.
 */
module.exports = class Component {
    constructor(type, customID) {
        /**
         * The type of this component.
         * @see enums.ComponentType
         * @type {number}
         */
        this.type = type;

        /**
         * The custom ID of this component.
         * @type {string}
         */
        this.id = customID;
    }

    /**
     * An alias for {@link Component#id}.
     * @type {string}
     */
    get customID() {
        return this.id;
    }

    /**
     * Turns raw Discord data into a {@link Component}.
     * @static
     * @param {object} data The raw JSON data.
     * @returns {Component} The component made from the raw data.
     */
    static fromJSON(data) {
        return new this(data.type, data.custom_id);
    }

    /**
     * A JSON object representing this component. (type and custom_id)
     * @returns {Object} A JSON object with the type and custom_id keys
     */
    toJSON() {
        return {
            type: this.type,
            custom_id: this.id
        }
    }
}