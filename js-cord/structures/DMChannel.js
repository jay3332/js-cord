const Messageable = require("../structures/Messageable");

module.exports = class DMChannel extends Messageable {
    constructor(client, channel_id, user) {
        super(client, channel_id);
        this.type = "dm";
        this.user = user;
    }
};