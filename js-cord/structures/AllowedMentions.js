class AllowedMentions {
    constructor(obj) {
        if (!obj.users) this.users = true;
        else this.users = obj.users;
        if (!obj.roles) this.roles = true;
        else this.roles = obj.roles;
        if (!obj.everyone) this.everyone = true;
        else this.everyone = obj.everyone;
        if (!obj.replies) this.replies = true;
        else this.replies = obj.replies;
    }
    static none() {
        return new AllowedMentions({
            users: false,
            roles: false,
            everyone: false,
            replies: false
        });
    }
    static all() {
        return new AllowedMentions({
            users: true,
            roles: true,
            everyone: true,
            replies: true
        });
    }
    static default() {
        return AllowedMentions.all();
    }
    static fromArray(arr) {
        let users = arr.includes("users");
        let roles = arr.includes("roles");
        let everyone = arr.includes("everyone");
        let replies = arr.includes("replies");
        return new AllowedMentions({
            users: users,
            roles: roles,
            everyone: everyone,
            replies: replies
        });
    }
}

module.exports = AllowedMentions;