const Permissions = require('./Permissions');
const DiscordObject = require('./DiscordObject');
const Color = require('./Color');

/**
 * Represents a Discord role.
 * @extends {DiscordObject}
 */
module.exports = class Role extends DiscordObject {
    constructor(client, guild, data) {
        super(data.id);
        this.client = client;

        /**
         * The guild that has this role.
         * @type {Guild}
         */
        this.guild = guild;

        if (data) this.loadData(data);
    }

    loadData(data) {
        /**
         * The name of the role.
         */
        this.name = data.name;

        /**
         * The color of the role.
         * @type {Color}
         */
        this.color = new Color(data.color);

        /**
         * Whether or not the role is hoisted or not.
         * @type {boolean}
         */
        this.hoist = data.hoist;

        /**
         * The position of the role.
         * @type {number}
         */
        this.position = data.position;
        
        if (data.permissions)
            /**
             * The permissions of the role.
             * @type {Permissions}
             */
            this.permissions = new Permissions(BigInt(data.permissions));

        /**
         * @type {boolean}
         * Whether or not the role is managed.
         */
        this.managed = data.managed;

        /**
         * Whether or not the role is mentionable.
         * @type {boolean}
         */
        this.mentionable = data.mentionable;

        /**
         * Whether or not the role is the guild's nitro boosting role.
         * @type {boolean}
         */
        this.premium = data.tags?.premium_subsciber || false;

        /**
         * The ID of the bot that represents this role. {@link undefined} if this isn't a bot role.
         * @type {?string}
         */
        this.botID = data.tags?.bot_id;

        /**
         * The ID of the integration that manages this role. {@link undefined} if no integration manages this role.
         * @type {?string}
         */
        this.integrationID = data.tags?.integration_id;

        if (this.botID) this.bot = this.guild.getMember(this.botID);
    }

    /**
     * An alias for {@link Role#color}.
     */
    get colour() {
        return this.color;
    }

    /**
     * Gets a list of the members in the role's guild that are assigned to the role.
     */
    get members() {
        return this.guild.members.filter(member => member._roles.contains(this.id));
    }
}