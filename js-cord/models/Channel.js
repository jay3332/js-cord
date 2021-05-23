const DiscordObject = require('./DiscordObject');

module.exports = class Channel extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        this.type = data.type;
    }
}