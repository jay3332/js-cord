const DiscordObject = require('./DiscordObject');
const User = require('./User');
const Member = require('./Member');

module.exports = class Message extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        if (data.author || data.member) this.author = data.member 
            ? new Member(this.client, null, (
                data.member.user 
                    ? data.member
                    : { ...data.member, user: data.author } 
            )) 
            : new User(this.client, data.author);

        this.tts = data.tts;
        this.content = data.content;
        this.mentionsEveryone = data.mention_everyone;
        this.pinned = data.pinned;
        this.type = data.type;

        if (data.edited_timestamp)
            this.editedAt = new Date(Date.parse(data.edited_timestamp));

        this.channel = this.client.getChannel(data.channel_id);
        if (data.guild_id) this.guild = this.client.getGuild(data.guild_id);
    }

    toString() {
        return this.content;
    }
}
