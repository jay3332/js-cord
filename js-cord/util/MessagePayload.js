const Embed = require("../structures/Embed");
const Message = require("../structures/Message");

module.exports = async function getMessagePayload(content, options, type="send") {
    // available types: send, edit, webhook, webhookEdit
    if (typeof content === "object") {
        options = content;
        content = options.content || ""
    }

    let behavior = {}
    let payload = { content: content }
    let allOptions = [];

    if (options.embed instanceof Embed && !type=="webhook") {
        allOptions.push("embed");
        payload.embed = options.embed.json;
    } else if (options.embeds.some(embed => embed instanceof Embed) && type==="webhook") {
        allOptions.push("embed");
        payload.embeds = options.embeds.map(embed => embed.json);
    } else if (options.embed instanceof Embed) {
        allOptions.push("embed");
        payload.embeds = [ options.embed.json ]
    }

    if (["send", "webhook"].includes(type)) {
        if (typeof options.tts === "boolean") {
            allOptions.push("tts");
            payload.tts = options.tts;
        }
        if (typeof options.reference === "string") {
            allOptions.push("reference");
            payload.reference = options.reference;
        } else if (options.reference instanceof Message) {
            payload.reference = options.reference.id;
            allOptions.push("reference");
        }
    }

    if (payload.reference) payload.reference = { message_id: payload.reference }
    try { content = content.toString() } catch(_){}

    return payload
}
