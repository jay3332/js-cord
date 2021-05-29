const Asset = require('./Asset');
const DiscordObject = require('./DiscordObject'); 

/**
 * Represents a Discord user.
 * @extends DiscordObject
 */
module.exports = class User extends DiscordObject {
    constructor(client, data) {
        super(data.id);
        this.client = client;
        this.rawData = data;
        if (data) this.loadData(data);
    }

    loadData(data) {
        /**
         * The user's username.
         * @type {string}
         */
        this.name = data.username;

        /**
         * The user's discriminator.
         * @type {string}
         */
        this.discriminator = data.discriminator;
        
        /**
         * The user's avatar asset.
         * @type {Asset}
         */
        this.avatar = new Asset(`avatars/${data.id}`, data.avatar);
        
        /**
         * Whether or not the user is a bot account.
         * @type {boolean}
         */
        this.bot = data.bot;

        /**
         * Whether or not the user is an official system account.
         * @type {boolean}
         */
        this.system = data.system;
    }

    /**
     * Returns the user's full tag in the name#discrim format.
     * @type {string}
     */
    get tag() {
        return `${this.name}#${this.discriminator}`
    }
    
    /**
     * Returns the mention of the user.
     * @type {string}
     */
    get mention() {
        return `<@${this.id}>`
    }

    /**
     * Represents the user's nickname or friend nickname.
     * This is currently always the same as {@link User#name}.
     * @type {string}
     */
    get displayName() {
        return this.name
    }

    toString() {
        return this.tag;
    }

    /**
     * Whether or not the user's avatar is animated.
     * @type {boolean}
     */
    get avatarAnimated() {
        return this.avatar.animated
    }

    /**
     * The default avatar format for this user.
     * @type {?string}
     */
    get defaultFormat() {
        return this.avatar.defaultFormat
    }

    /**
     * The user's avatar URL.
     * @type {string}
     */
    get avatarURL() {
        return this.avatar.url;
    }

    /**
     * The user's avatar URL with customization options.
     * @param {?object} options The options for the URL.
     * @returns {string} The user's avatar URL.
     */
    avatarUrlAs(options) {
        return this.avatar.urlAs(options);
    }
}