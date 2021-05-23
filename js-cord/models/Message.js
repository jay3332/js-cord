const Object = require('./Object');
const User = require('./User');
const Member = require('./Member');

module.exports = class Message extends Object {
    constructor(client, data) {
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        super(data.id);

        if (this.author) this.author = data.member 
            ? new Member(this.client, null, data.member) 
            : new User(this.client, data.user);

        this.tts = data.tts;
        this.content = data.content;
        this.mentionsEveryone = data.mention_everyone;
        this.pinned = data.pinned;
        this.type = data.type;

        if (data.edited_timestamp)
            this.editedAt = new Date(Date.parse(data.edited_timestamp));
    }

    toString() {
        return this.content;
    }
}
