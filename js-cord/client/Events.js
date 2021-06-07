const Message = require('../models/Message');
const Guild = require('../models/Guild');
const ClientUser = require('../models/ClientUser');
const Interaction = require('../models/Interaction');
const InteractionHandler = require('./Interactions');

const WHITELISTED_EVENTS = [
    "READY", 
    "RESUMED",
    "GUILD_CREATE", 
    "GUILD_DELETE",
    "GUILD_MEMBER_ADD", 
    "GUILD_MEMBER_REMOVE",
    "GUILD_MEMBERS_CHUNK"
];

module.exports = async function emitEvent(client, ws, event, data) {
    event = event.toUpperCase().replace(" ", "_");

    // we don't want to start emitting events with no data
    if (!client.loggedIn && !WHITELISTED_EVENTS.includes(event))
        return;

    if (event === "READY") {
        ws.sessionID = data.session_id;
    
        if (!ws.shardID) {
            client.loggedIn = true;
            client.user = new ClientUser(client, data.user);
            client.startupTimestamp = parseFloat(process.hrtime().join("."));
            await client.emit("ready");
        }  
        if (client.sharded) {
            await client.emit("shardReady", ws.shardID);
        }
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
        // await guild.fillMembers();
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
            msg => msg.channel?.id == data.channel_id && msg.id == data.id
        );

        const message = new Message(client, data);
        client.cache.messages.push(message);
        if (cachedMessage) await client.emit("messageEdit", cachedMessage, message);
        await client.emit("rawMessageEdit", message);
    } else if (event === "MESSAGE_DELETE") {
        // Is the message in our cache?
        const cachedMessage = client.cache.messages.find(
            msg => msg.channel?.id == data.channel_id && msg.id == data.id
        );

        if (cachedMessage) await client.emit("messageDelete", cachedMessage);
        await client.emit("rawMessageDelete", data);
    }
    
    // interactions
    else if (event === "INTERACTION_CREATE") {
        await client.emit('rawInteraction', data);
        const interaction = new Interaction(client, data);
        await client.emit('interaction', interaction);
        await InteractionHandler(interaction);
    }
}