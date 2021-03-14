const Check = require("../commands/Check");
const Permissions = require("../structures/Permissions");

module.exports = class Cog {
    constructor(bot) {
        if (!this.name) this.name = this.constructor.name;
        this.listeners = {};
        this.client = bot;

        if (!this.check) this.check = Check.none();
        if (!this.permissions) this.permissions = Permissions.none();
        if (!this.guildOnly) this.guildOnly = this.client.guildOnly;
    }
    command(options, exec) {
        if (typeof options !== "object") {
            options = { name: options };
        } options["cog"] = this;
        this.client.command(options, exec);
    }
    listen(event, exec) {
        this.listeners[event] = exec;
    }
    get commands() {
        return this.client.commands.filter(command => command.cog.name === this.name);
    }
}