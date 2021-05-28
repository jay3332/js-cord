const Permissions = require('./Permissions');
const DiscordObject = require('./DiscordObject');
const Color = require('./Color');

/**
 * Represents a Discord role.
 * @extends DiscordObject
 */
module.exports = class Role extends DiscordObject {
    constructor(client, guild, data) {
        super(data.id);
        this.client = client;

        /**
         * The guild that has this role.
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
         * @type {Color}
         * The color of the role.
         */
        this.color = new Color(data.color);

        /**
         * @type {boolean}
         * Whether or not the role is hoisted or not.
         */
        this.hoist = data.hoist;

        /**
         * @type {number}
         * The position of the role.
         */
        this.position = data.position;
        
        if (data.permissions)
            /**
             * @type {Permissions}
             * The permissions of the role.
             */
            this.permissions = new Permissions(BigInt(data.permissions));

        /**
         * @type {boolean}
         * Whether or not the role is managed.
         */
        this.managed = data.managed;

        /**
         * @type {boolean}
         * Whether or not the role is mentionable.
         */
        this.mentionable = data.mentionable;

        /**
         * @type {boolean}
         * Whether or not the role is the guild's nitro boosting role.
         */
        this.premium = data.tags?.premium_subsciber || false;

        /**
         * @type {?string}
         * The ID of the bot that represents this role. {@link undefined} if this isn't a bot role.
         */
        this.botID = data.tags?.bot_id;

        /**
         * @type {?string}
         * The ID of the integration that manages this role. {@link undefined} if no integration manages this role.
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