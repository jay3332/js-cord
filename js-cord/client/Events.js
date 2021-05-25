const Message = require('../models/Message');
const Guild = require('../models/Guild');
const ClientUser = require('../models/ClientUser');

const WHITELISTED_EVENTS = [
    "READY", 
    "RESUMED",
    "GUILD_CREATE", 
    "GUILD_DELETE",
    "GUILD_MEMBER_ADD", 
    "GUILD_MEMBER_REMOVE",
    "GUILD_MEMBERS_CHUNK"
];

module.exports = async function emitEvent(client, event, data) {
    event = event.toUpperCase().replace(" ", "_");
    if (!client.loggedIn && !WHITELISTED_EVENTS.includes(event))
        // we don't wanna start emitting events with no data
        return;

    if (event === "READY") {
        client.startupTimestamp = parseFloat(process.hrtime().join("."));
        client.ws.sessionID = data.session_id;
        client.loggedIn = true;
        client.user = new ClientUser(client, data.user);
        await client.emit("ready")
        
    } else if (event === "RESUMED") {
        await client.emit("resumed");
    } else if (event === "RECONNECT") {
        await client.emit("reconnect")
    }
    
    // guilds
    else if (event === "GUILD_CREATE") {
        const unavailable = data.unavailable;
        if (unavailable) return;

        const guild = new Guild(client, data);
        client.cache.guilds.push(guild);
        if (unavailable === false)
            await client.emit("guildAvailable", guild);
        else
            await client.emit("guildJoin", guild);
    }

    // messages
    else if (event === "MESSAGE_CREATE") {
        const message = new Message(client, data);
        client.cache.messages.push(message);
        await client.emit("message", message);
    } else if (event === "MESSAGE_UPDATE") {
        // Is the message in our cache?
        const cachedMessage = client.cache.messages.find(
            msg => msg.channel.id == data.channel_id && msg.id == data.id
        );

        const message = new Message(client, data);
        client.cache.messages.push(message);
        if (cachedMessage) await client.emit("messageEdit", cachedMessage, message);
        await client.emit("rawMessageEdit", message);
    }
}