class AllowedMentions {
    constructor(obj) {
        if (!obj.users) this.users = true;
        else this.users = obj.users;
        if (!obj.roles) this.roles = true;
        else this.roles = obj.roles;
        if (!obj.everyone) this.everyone = true;
        else this.everyone = obj.everyone;
    }
    static none() {
        return AllowedMentions({
            users: false,
            roles: false,
            everyone: false
        });
    }
    static all() {
        return AllowedMentions({
            users: true,
            roles: true,
            everyone: true
        });
    }
    static fromArray(arr) {
        let users = arr.includes("users");
        let roles = arr.includes("roles");
        let everyone = arr.includes("everyone");
        return AllowedMentions({
            users: users,
            roles: roles,
            everyone: everyone
        });
    }
}

module.exports = AllowedMentions;