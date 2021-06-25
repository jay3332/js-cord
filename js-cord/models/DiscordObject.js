const { parseSnowflake } = require('../utils');

/**
 * Represents a Discord object with a snowflake.
 */
module.exports = class DiscordObject {
    constructor(id) {
        /**
         * The date and time that this object was created.
         * @type {Date}
         */
        this.createdAt = parseSnowflake(id);

        /**
         * The ID of this object.
         * @type {string}
         */
        this.id = id;
    }

    /**
     * Check whether or not another object is equal to this one.
     * This may be unreliable as some snowflakes can interfere with others
     * 
     * For example, this would return true if you compare a guild with it's default role.
     * 
     * @param {DiscordObject} other The object to compare with.
     * @returns {boolean} Whether or not the two objects are equal.
     */
    equals(other) {
        return other.id == this.id;
    }
}