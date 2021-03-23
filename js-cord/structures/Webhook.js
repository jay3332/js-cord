module.exports = class Webhook {
    constructor(client, data) {
        this.name = data.name;
        this.avatar = data.avatar;
        this.token = data.token;
        this.type = data.type;
        this.guild = data.guild_id
            ? client.getGuild(data.guild_id) : undefined;
        this.channel = data.channel_id
            ? client.getChannel(data.channel_id) : undefined;
        this.creator = data.user.id
            ? client.getUser(data.user.id) : undefined;
        this.applicationID = data.application_id;
    }
    edit() {
        // this.client.http.editWebhook()
    }
    delete() {
        // this.client.http.deleteWebhook()
    }
    send(id, token, options) {
        this.client.http.webhookSend(id, token, options);
    }
    // will work on http later
}
