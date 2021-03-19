const Cooldown = require("../commands/Cooldown");

module.exports = class CooldownManager {
    constructor(bot) {
        this.bot = bot;
        this.users = {};
        this.channels = {};
        this.guilds = {};
        this.global = {};
    }
    async startCooldown(ctx) {
        if (!ctx.cooldown) return;

        // retrieve the cooldown
        let cooldown = ctx.cooldown;
        if (cooldown instanceof Function)
            cooldown = await cooldown(ctx);
        if (!cooldown instanceof Cooldown) {
            throw new TypeError("Cooldowns must inherit discord.Cooldown or a function that returns one.")
        }
        if (ctx.cooldown.cooldown === 0) return;
        
        
    }
}