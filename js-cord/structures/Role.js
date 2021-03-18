const { parseHex } = require("../util/Useful");

module.exports = class Role {
	constructor(client, data, guild) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        this.colour = data.color.toString(16);
        this.hoisted = data.hoist;
        this.position = data.position;
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        this.guild = guild;
        this.premium = false;
        this.default = this.id === guild.id;

        if (this.tags) {
            if (this.tags.bot_id)
                this.manager = this.guild.getMember(this.tags.bot_id);
            if (this.tags.premium_subscriber) 
                this.premium = true;
            if (this.tags.integration_id)
                {}; 
        }
	}
    get members() {
        return this.guild.members.filter(member => member.roles.map(role => role.id).includes(this.id));
    }
    get color() { return this.colour }

    async delete(reason) {
        await this.client.http.deleteRole(this.guild.id, this.id);
        this.guild.cache.removeRole(this.id);
        return this;
    }

    async edit({ name, permissions, colour, color, hoist=null, mentionable=null }) {
        let finalColor = colour || color || null;
        if (finalColor) finalColor = parseHex(finalColor);
        const res = await this.client.http.editRole(this.guild.id, this.id, {
            name: name || null,
            permissions: null,
            color: finalColor,
            hoist: hoist,
            mentionable: mentionable
        });
        const newRole = new Role(res);
        this.guild.cache.addRole(newRole);
        return newRole;
    }
}
