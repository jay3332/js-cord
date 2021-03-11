// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
	console.log(`Logged in as ${bot.user}`);
})

// Basic ping command
bot.command("ping", ctx => {
	ctx.reply("Pong!");
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/applications
*/