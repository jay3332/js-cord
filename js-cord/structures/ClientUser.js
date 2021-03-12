const User = require("../structures/User");

class ClientUser extends User {
    constructor(http) {
        const data = http.getClientUser();
        super(data["id"]);
        this.email = data['email'];
        this.verified = data['verified'];
        this.locale = data['locale'];
    }    
}

module.exports = ClientUser;