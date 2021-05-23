const { parseSnowflake } = require('../utils');

module.exports = class DiscordObject {
    constructor(id) {
        this.createdAt = parseSnowflake(id);
        this.id = id;
    }
}