const User = require("../structures/User");

class ClientUser extends User {
    constructor(client, data=null) {
        const data = data || client.http.getClientUser();
        super(client, data['id']);
        this.mfa = data['mfa_enabled'];
        this.email = data['email'];
        this.verified = data['verified'];
        this.locale = data['locale'];
    }
}

module.exports = ClientUser;