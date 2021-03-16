/**
 * Represents something that you can send to.
 * These will extend this class.
 */

// const Embed = require("../structures/Embed");
// const Message = require("../structures/Message");
const Messageable = require("../structures/Messageable");
const User = require("../structures/User");
// const Guild = requi;re("../structures/Guild");
const Util = require("../util/Util")

class Channel extends Messageable {
    constructor(client, data, deleted=false) {
        super(client, data.id);
        this.client = client;
        this.id = data.id;
        let _type = ['text', 'dm', 'voice', 'group', 'category', 'news', 'store'][data['type']];
        this.type = !_type ? 'unknown' : _type.toLowerCase();
        if (this.id) { this.createdAt = Util.parseSnowflake(this.id); }
        this.deleted = false;
    }

    toString() {
        return `Generic channel with id ${this.id} and type ${this.type}`
    }

    delete() {
        let response = this.client.http.deleteChannel(this.id);
        this.deleted = true;

        return new Channel(this.client, response, true);
    }

    get textBased() {
        return ['text', 'dm', 'news', 'group'].includes(this.type);
    }

}

module.exports = Channel;