const ClientUser = require("../structures/ClientUser");
const Message = require("../structures/Message");

const whitelist = [
    "READY", "RESUMED", 
    "GUILD_CREATE", "GUILD_DELETE",
    "GUILD_MEMBER_ADD", "GUILD_MEMBER_REMOVE",
    "GUILD_MEMBERS_CHUNK"
];

module.exports = function handleEvent(client, event, data) {
    event = event.toUpperCase().replace(" ", "_");
    if (!client.loggedIn && !whitelist.includes(event))
        // we don't wanna start emitting events with no data
        return;
    if (event === "READY") {
        client.loggedIn = true;
        client.user = new ClientUser(client, data['user']);
        client.emit("ready");
    } else if (event === "RESUMED") {
        client.emit("resumed");
    } else if (event === "RECONNECT") {
        client.emit("reconnect") 
    } 

    // channels
    else if (event === "CHANNEL_CREATE") {
        client.emit("channel")
    } // wip because channel support is currently partial

    // messages
    else if (event === "MESSAGE_CREATE") {
        client.emit("message", [Message.fromData(client, data)]);
        // somehow, we add this message to the cache
    } // we need to make a message cache, or else 
    // MESSAGE_EDIT/MESSAGE_DELETE won't be able to take payloads
    else if (event === "MESSAGE_UPDATE") {
        client.emit("messageEdit", [null /*some way to get the old message*/, Message.fromData(client, data)]);
    } else if (event === "MESSAGE_DELETE") {
        client.emit("messageDelete", [null] /*again, some way to get the old message*/)
    } else if (event === "MESSAGE_DELETE_BULK") {
        client.emit("messageBulkDelete", [null] /*what i said above, but iterate through id's*/)
    }

    // debugging, comment out rather than delete
    console.log(event);
}