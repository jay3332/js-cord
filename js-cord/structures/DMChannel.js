const Channel = require("../structures/Channel");

module.exports = class DMChannel extends Channel {
    constructor(client, data, user) {
        super(client, data);
        this.user = user;
    }
}