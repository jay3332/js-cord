module.exports = class AllowedMentions {
    static all() {
        return {
            users: true,
            roles: true,
            everyone: true,
            replies: true
        }
    }

    static none() {
        return {
            users: false,
            roles: false,
            everyone: false,
            replies: false
        }
    }

    static default() {
        return {
            users: true,
            roles: false,
            everyone: false,
            replies: false
        }
    }
}