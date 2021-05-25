module.exports = class SnowflakeSet extends Array {
    /**
     * Represents an array of DiscordObjects (ones that have parameter `id`).
     * This ensures that only one copy of any snowflake is present in this array.
     */
    constructor(...args) {
        super(...args);
    }

    push(...objects) {
        for (const object of objects) {
            const idx = this.map(o => o.id).indexOf(object.id);
            if (idx !== -1) 
                this[idx] = object;
            else {
                super.push(object);
            }
        }
    }
}