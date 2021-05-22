const Object = require('./Object');
const User = require('./User');
const Member = require('./Member');

module.exports = class Message extends Object {
    constructor(client, data) {
        this.#client = client;
        this.#rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        super(data.id);
        this.author = data.member 
            ? new Member(this.#client, null, data.member) 
            : new User(this.#client, data.user);
    }
}
