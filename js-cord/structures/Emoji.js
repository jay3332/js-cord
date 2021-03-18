const Role = require("../structures/Role");
const User = require("../structures/User");
const PartialEmoji = require("../structures/PartialEmoji");
const { parseSnowflake, parseAssetSize } = require("../util/Util");

module.exports = class Emoji {
    constructor(client, data, guild) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        if (data.user) 
            this.user = new User(client, data.user);
        if (data.roles) {
            this.roles = data.roles.map(role => new Role(client, role));
        } else { this.roles = [] }
        this.animated = data.animated || false;
        this.managed = data.managed || true;
        this.requiresColons = data.require_colons;
        this.createdAt = parseSnowflake(this.id);
        this.available = data.available;
        this.partial = new PartialEmoji(this.client, {
            name: this.name,
            id: this.id,
            animated: this.animated
        });
        this.guild = guild;
    }
    get defaultFormat() {
        return this.animated ? "gif" : "png";
    }
    get url() {
        return this.urlAs({ format: this.defaultFormat });
    }
    get useable() {
        if (!this.available) return false;
        if (!this.roles.length) return true;
        let myRoles = this.guild.me.roles;
        myRoles = myRoles.map(r => r.id);
        for (role of this.roles) {
            if (myRoles.includes(role.id)) {
                return true;
            }
        }
        return false;
    }
    get usable() {
        return this.useable;
    }
    get requestEmoji() {
        return this.partial.requestEmoji;
    }
    urlAs({ format, size }) {

        let url = `https://cdn.discordapp.com/emojis/${this.id}.`;
        
        format = format               ? format.toLowerCase() : this.defaultFormat;
        size   = parseAssetSize(size) ? `?size=${size}`      : "";
        
        let validFormats = [ "png" ];
        if (this.animated) validFormats.push("gif");
        if (!validFormats.includes(format)) format = this.defaultFormat; 

        return url + format + size;
    }
    toString() {
        let anim = this.animated ? "a" : "";
        return `<${anim}:${this.name}:${this.id}>`;
    }
    async delete() {
        await this.client.http.deleteEmoji(this.guild.id, this.id);
        this.guild.cache.removeEmoji(this.id);
        return this;
    }
    async edit({ name, roles }) {
        let roleMap = null;
        if (roles) roleMap = roles.map(r => r.id);
        let newEmoji = await this.client.http.editEmoji(this.guild.id, this.id, {
            name: name || null,
            roles: roleMap || null
        });
        this.guild.cache.addEmoji(newEmoji);
    }
    async rename(name) {
        return await this.edit({ name: name });
    }
    async addRole(role) {
        let rolesModified = [role, ...this.roles];
        return await this.edit({ roles: rolesModified });
    }
    async removeRole(role) {
        if (!this.roles.map(r => r.id).includes(role.id)) return;
        let rolesModified = this.roles.filter(r => r.id !== role.id);
        return await this.edit({ roles: rolesModified });
    }
}