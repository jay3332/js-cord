const DiscordObject = require('./DiscordObject');

module.exports = class AuditLogEntry extends DiscordObject {
    constructor(client, data) {
        this.client = client;
        this.rawData = data;
        if (data) {
            this.loadData(data);
            super(data.id)
        }
    }

    loadData(data) {
        this.targetID = data.target_id;
        this.changes = data.changes; // might need a new object for this // yeah srue
        // https://discord.com/developers/docs/resources/audit-log#audit-log-change-object
        this.user = this.client.getUser(data.user_id);
        this.event = data.action_type;
        this.options = data.options;
        this.reason = data.reason;
    }
}