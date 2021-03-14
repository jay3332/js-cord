/**
 * Manages the connection between Discord.
 */

const AllowedMentions = require("../structures/AllowedMentions");
const Intents = require("../structures/Intents");

class Connection {
    constructor(options) {
        this.allowedMentions = options.hasOwnProperty("allowedMentions") ? options.allowedMentions : AllowedMentions.default();
        this.intents = options.hasOwnProperty("intents") ? options.intents : Intents.default();
    }
}