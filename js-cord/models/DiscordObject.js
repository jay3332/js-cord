const { parseSnowflake } = require('../utils');

/**
 * Represents a Discord object with a snowflake.
 */
module.exports = class DiscordObject {
    constructor(id) {
        /**
         * @type {Date}
         * The date and time that this object was created.
         */
        this.createdAt = parseSnowflake(id);

        /**
         * @type {string}
         * The ID of this object.
         */
        this.id = id;
    }
}