// Import the library
const discord = require("js-cord");

// Our Cog will extend discord.Cog
class MyCog extends discord.Cog {
    constructor(bot) {
        // A command in this cog
        bot.command("add", (ctx, first, second) {
            const result = parseInt(first) + parseInt(second);
            ctx.reply(`${first} + ${second} is ${result}.`);
        });
    }
} 

// Add the cog to our exports
module.exports = { cog: MyCog, setup: bot => MyCog(bot)}
