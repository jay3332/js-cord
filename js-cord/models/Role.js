const Permissions = require('./Permissions');
const DiscordObject = require('./DiscordObject');
const Color = require('./Color');

module.exports = class Role extends DiscordObject {
    constructor(client, guild, data) {
        super(data.id);
        this.client = client;
        this.guild = guild;
        if (data) this.loadData(data);
    }

    loadData(data) {
        this.name = data.name;
        this.color = new Color(data.color);
        this.hoist = data.hoist;
        this.position = data.position;
        if (data.permissions)
            this.permissions = new Permissions(BigInt(data.permissions));
        this.managed = data.managed;
        this.mentionable = data.mentionable;

        this.premium = data.tags?.premium_subsciber || false;
        this.botID = data.tags?.bot_id;
        this.integrationID = data.tags?.integration_id;

        if (this.botID) this.bot = this.guild.getMember(this.botID);
    }

    get colour() {
        return this.color;
    }

    get members() {
        return this.guild.members.filter(member => member._roles.contains(this.id));
    }
}