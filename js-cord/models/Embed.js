module.exports = class Embed {
    constructor(data) {
        if (data) {
            this.type = data.type || 'rich';
            this.title = data.title;
            this.description = data.description;
            this.url = data.url;
            this.timestamp = new Date(Date.parse(data.timestamp));
            this.color = null //wip
        }
    }
    
    get colour() {
        return this.color;
    }
}