const DiscordObject = require('./DisordObject');
const Asset = require('./Asset');

module.exports = class Guild extends DiscordObject {
    constructor(client, data) {
        this.client = client;
        this.rawData = data;
        if (data) {
            this.loadData(data);
            super(data.id);
        }
    }

    loadData(data) {
        this.name = data.name;
        this.icon = new Asset(`icons/${data.id}`, data.icon);
        this.splash = new Asset(`splashes/${data.id}`, data.splash);
        this.region = data.region;
        this.members = data.members.map(member => {
            let obj = new Member(this.client, member);
            let user = obj.toUser();
            
            if (user) this.client.cache.users.push(user);
            return obj;
        });
    }
}