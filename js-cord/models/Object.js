const { parseSnowflake } = require('../utils');

module.exports = class Object {
    constructor(id) {
        this.createdAt = parseSnowflake(id);
        this.id = id
    }
}