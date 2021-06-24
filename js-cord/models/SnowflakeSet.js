const DiscordObject = require("./DiscordObject");

/**
 * Represents a map of snowflakes to their DiscordObjects (ones that have parameter `id`).
 * This ensures that only one copy of any snowflake is present in this map.
 * @extends {Map}
 */
module.exports = class SnowflakeSet extends Map {
    constructor(...args) {
        super(...args);
    }

    /**
     * Adds objects to the set.
     * @param  {...any} objects The object(s) to add.
     */
    push(...objects) {
        for (const object of objects) {
            this.set(object.id, object);
        }
    }

    /**
     * Filters the set based on a function.
     * @see Array#filter
     * @param {function} predicate The filtering function to use. 
     * @returns {Array<DiscordObject>} An array of the filtered objects.
     */
    filter(predicate) {
        let passed = [];
        for (const value of this.values()) {
            if (predicate(value))
                passed.push(value);
        }
        return passed;
    }

    /**
     * Finds the first object in the set that meets the predicate, and returns it.
     * @see Array#find
     * @param {function} predicate The check function to use.
     * @returns {?DiscordObject} The object found, if any.
     */
    find(predicate) {
        for (const value of this.values()) {
            if (predicate(value))
                return value;
        }
    }
}