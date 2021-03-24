const PartialEmoji = require("../structures/PartialEmoji");

module.exports = class Menu {
    constructor(messageable, { raw=false, restricted=false, user }={}) {
        this.client = messageable.client;
        this.destination = messageable;
        this.author = user;

        this._raw = raw, this._restricted=restricted;
        if (!this.author) this._restricted=false;
        this._buttons = [];
        this._active = false;
    }
    async send(content, options={}) {
        const message = await this.destination.send(content, options);
        this.message = message;
        this.channel = message.channel;
        this.guild = message.guild;
        return this;
    }
    addButton(emoji, callback) {
        if (typeof emoji === "string") {
            if (emoji.length > 6) {
                emoji = emoji.replace(/[<>]/g, "");
                if (emoji.startsWith("a:")) {
                    emoji = emoji.replace("a:", "");
                } if (emoji.startsWith(":")) {
                    emoji = emoji.replace(":", "");
                }
                let [ name, id ] = emoji.split(":");
                emoji = new PartialEmoji(this.client, {
                    name: name, id: id
                });
            }
            else {
                emoji = new PartialEmoji(this.client, {
                    name: emoji, id: null
                })
            }
        }
        const event = this._raw ? "rawReactionAdd" : "reactionAdd";
        const removeEvent = this._raw ? "rawReactionRemove" : "reactionRemove";
        const _callback = this._raw ? (async(payload) => {
            if (!this._active) return;
            if (payload.emoji.requestEmoji !== emoji.requestEmoji)
                return;
            if (`${payload.channel_id}-${payload.message_id}` !==
                this.message.fullID) return;
            if (!(payload.user_id === this.author.id && this._restricted))
                return;
            await callback(payload);
        }) : (async(reaction, user) => {
            if (!this._active) return;
            if (reaction.emoji.requestEmoji !== emoji.requestEmoji)
                return;
            if (reaction.message.fullID !== this.message.fullID)
                return;
            if (!(user.id === this.author.id && this._restricted))
                return;
            await callback(reaction, user);
        });
        this._buttons.push(emoji);
        this.client.addListener(event, _callback);
        this.client.addListener(removeEvent, _callback);
        return this;
    }
    removeButton(emoji) {
        this._buttons = this._buttons.filter(button => !(button===emoji ||
            button.name===emoji || button.id==emoji || button.toString()===emoji || button.requestEmoji===emoji));
        return this;
    }
    async start({ timeout=0 }) {
        if (!this.message)
            throw new Error("You must send the starting message to start the menu. (See `Menu#send`)");
        this._active = true;
        for (button of this._buttons) {
            await this.message.addReaction(button);
        }
    }
    stop() {
        if (this._active) this._active=false;
    }
}
