module.exports = class Webhook {
    constructor(client, data) {
        this.name = data.name;
        this.avatar = data.avatar;
        this.token = data.token;
        this.type = data.type;
        this.guildId = data.guild_id
            ? client.getGuild(data.guild_id) : undefined;
        this.channelId = data.channel_id
            ? client.getChannel(data.channel_id) : undefined;
        this.creator = data.user.id
            ? client.getUser(data.user.id) : undefined;
        this.applicationId = data.application_id;
    }
    edit() {
        // this.client.http.editWebhook()
    }
    delete() {
        // this.client.http.deleteWebhook()
    }
    send() {
        // this.client.http.webhookSend()
    }
    // will work on http later
}
