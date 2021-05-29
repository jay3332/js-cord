const User = require('./User');

/**
 * Represents the client as a user.
 * Because the client has accesse to it's own information, 
 * it will have access to more properties than any other user.
 * @extends User
 */
module.exports = class ClientUser extends User {
    constructor(client, data) {
        super(client, data);
        this.loadData(data);
    }

    loadData(data) {
        super.loadData(data);
        
        /**
         * Whether or not 2-factor authentication is enabled on this account.
         * @type {?boolean}
         */
        this.mfaEnabled = data.mfa_enabled;

        /**
         * The chosen language option.
         * @type {?string}
         */
        this.locale = data.locale;

        /**
         * Whether or not this account has a verified email.
         * @type {?boolean}
         */
        this.verified = data.verified;
    }
}