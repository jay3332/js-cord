/**
 * Utility constants to aid in providing allowed mentions for messages.
 */
module.exports = class AllowedMentions {
    /**
     * Allowed mentions with all mentions enabled.
     * @returns {object}
     */
    static all() {
        return {
            users: true,
            roles: true,
            everyone: true,
            replies: true
        }
    }

    /**
     * Allowed mentions with all mentions disabled.
     * @returns {object}
     */
    static none() {
        return {
            users: false,
            roles: false,
            everyone: false,
            replies: false
        }
    }

    /**
     * Allowed mentions with only user mentions enabled.
     * @returns {object}
     */
    static default() {
        return {
            users: true,
            roles: false,
            everyone: false,
            replies: false
        }
    }
}