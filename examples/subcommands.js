// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// Make a group command.
const ping = bot.group("ping", ctx => {
    if (!ctx.subcommand) ctx.reply("Pong!");
});

/** 
 * Note: There is a much better way rather than
 *       doing (!ctx.subcommand):
 * 
 *  const ping = bot.group({ name: "ping", noCommand: true }, ctx => {
        ctx.reply("Pong!");
    });
 */

// Here is the subcommand:
// This will be invoked as "!ping pong"
ping.command("pong", ctx => {
    ctx.reply("Ping pong!");
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/developers/applications
*/
