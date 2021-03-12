// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

bot.listen("commandError", (ctx, error) => {
    if (error instanceof discord.errors.CooldownError) {
        ctx.send(`Wait ${error.secondsLeft} seconds before using this command again.`);
        return;
    }
    throw error; // Throw the error if the error isn't a cooldown error, since we handled that already
});

// Cooldown is user specific, it can be used 1 time per 5 seconds.
bot.command({name: "ping", cooldown: new discord.Cooldown(1, 5)}, ctx => {
    ctx.send("Pong!");
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/applications
*/