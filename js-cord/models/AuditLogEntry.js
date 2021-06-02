const DiscordObject = require('./DiscordObject');

module.exports = class AuditLogEntry extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        this.targetID = data.target_id;
        this.changes = data.changes;
        this.user = this.client.getUser(data.user_id);
        this.event = data.action_type;
        this.options = data.options;
        this.reason = data.reason;
    }
}