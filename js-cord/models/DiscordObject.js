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
}