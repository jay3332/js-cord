const User = require("../structures/User");

class ClientUser extends User {
    constructor(client) {
        const data = null;
        client.http.getClientUser().then(res => data=res);
        super(client, data['id']);
        this.email = data['email'];
        this.verified = data['verified'];
        this.locale = data['locale'];
    }
}

module.exports = ClientUser;