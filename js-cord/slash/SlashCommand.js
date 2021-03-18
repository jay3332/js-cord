module.exports = class SlashCommand {
    constructor(client, data) {
        // represents a slash command
        this.client = client;
        this.id = data.id;
        const app = data.application_id;
        this.application = this.client.getUser(app) || app;
        
    }
}