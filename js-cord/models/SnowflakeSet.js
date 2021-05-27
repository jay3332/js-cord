module.exports = class SnowflakeSet extends Map {
    /**
     * Represents a map of snowflakes to their DiscordObjects (ones that have parameter `id`).
     * This ensures that only one copy of any snowflake is present in this map.
     */
    constructor(...args) {
        super(...args);
    }

    push(...objects) {
        for (const object of objects) {
            this.set(object.id, object);
        }
    }

    filter(predicate) {
        let passed = [];
        for (const value of this.values()) {
            if (predicate(value))
                passed.push(value);
        }
        return passed
    }

    find(predicate) {
        for (const value of this.values()) {
            if (predicate(value))
                return value;
        }
    }
}