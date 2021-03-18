const ClientUser = require("../structures/ClientUser");
const Message = require("../structures/Message");
const Guild = require("../structures/Guild");

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
        client.user = new ClientUser(client, data.user);
        client.emit("ready");
    } else if (event === "RESUMED") {
        client.emit("resumed");
    } else if (event === "RECONNECT") {
        client.emit("reconnect") 
    } 

    // guilds 
    else if (event === "GUILD_CREATE") {
        const unavailable = data.unavailable || null;
        if (unavailable) return;

        const guild = new Guild(client, data);
        client.cache.addGuild(guild);
        if (unavailable === false) 
            client.emit("guildAvailable", [ guild ]);
        else
            client.emit("guildJoin", [ guild ]);
    }

    // channels
    else if (event === "CHANNEL_CREATE") {
        client.emit("channel")
    } // wip because channel support is currently partial

    // messages
    else if (event === "MESSAGE_CREATE") {
        let msg = new Message(client, data);
        client.cache.addMessage(msg);
        client.emit("message", [ msg ]);
    } 
    else if (event === "MESSAGE_UPDATE") {
        let rawEvent = data;
        let newMsg = new Message(client, data);
        client.cache.addMessage(newMsg);
        let oldMsg = client.cache.getMessage(data.channel_id, data.id);
        if (oldMsg) rawEvent.cachedMessage = oldMsg;
        client.emit("rawMessageEdit", [ rawEvent ]);
        client.emit("messageEdit", [oldMsg, newMsg]);
    } else if (event === "MESSAGE_DELETE") {
        client.emit("rawMessageDelete", [ data ]);
        let deletedMsg = client.cache.getMessage(data.channel_id, data.id);
        client.emit("messageDelete", [deletedMsg])
    } else if (event === "MESSAGE_DELETE_BULK") {
        client.emit("rawMessageBulkDelete", [ data ]);
        let converted = data.ids
            .map(id => client.cache.getMessage(data.channel_id, id))
            .filter(maybeMessage => !!maybeMessage);
        client.emit("messageBulkDelete", [converted]);
    }

    // debugging, comment out rather than delete
    // console.log(event);
}