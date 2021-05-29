const User = require('./User');
const Permissions = require('./Permissions');
//const Guild = require('./Guild');

/**
 * Represents a guild member.
 * @extends {User}
 */
module.exports = class Member extends User {
    constructor(client, guild, data) {
        super(client, data.user);
        this.client = client;
        this.rawData = data;

        /**
         * @type {Guild}
         * The guild that this member is in.
         */
        this.guild = guild;
        this.loadData(data);
    }

    /**
     * Gets a {@link User} representation of this member.
     * @returns {User} The resulting User object of this member.
     */
    toUser() {
        if (this.user)
            return this.user;
        if (this.rawData.user)
            return new User(this.client, this.rawData.user);
    }

    loadData(data) {
        if (data.user) {
            super.loadData(data.user);
            this.user = new User(this.client, data.user);
        }
        /**
         * The nickname of the member, if any.
         * @type {?string} 
         */
        this.nick = data.nick;
        
        /**
         * The date and time the member joined at.
         * @type {Date}
         */
        this.joinedAt = new Date(Date.parse(data.joinedAt));
        this.deafened = data.deaf;
        this.muted = data.mute;
        this.pending = data.pending;
        if (data.permissions)
            this.permissions = new Permissions(BigInt(data.permissions)); 
        this._roles = data.roles;
    }

    get displayName() {
        return this.nick || this.name
    }

    get roles() {
        return this.guild.roles.filter(role => this._roles.includes(role.id));
    }
}
