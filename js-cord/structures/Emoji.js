module.exports = class Emoji {
    constructor(client, data) {
        this.client = client;
        this.id = data.id;
    }
}