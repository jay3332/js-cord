const SnowflakeSet = require('../models/SnowflakeSet');


module.exports = class Connection {
    constructor(http = null, ws = null) {
        this.http = http;
        this.ws = ws;

        this.cache = {
            guilds: new SnowflakeSet(),
            channels: new SnowflakeSet(),
            users: new SnowflakeSet(),
            messages: new SnowflakeSet(),
            emojis: new SnowflakeSet(),
            roles: new SnowflakeSet(),
            commands: new SnowflakeSet()
        }

        this._slash = [];
        this._components = [];
        this._dropdownOpts = [];
    }
}
