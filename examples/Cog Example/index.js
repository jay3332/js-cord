// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// Basic ping command
bot.command("ping", ctx => {
    ctx.reply("Pong!");
});

// Add the cog
bot.addCog("./my_cog");

// We can reload cogs to update them, without having to completely restart our bot.
bot.command({ name: "reload", check: discord.Check.ownerOnly() }, (ctx, ...cogPath) => {
    try {
        bot.reloadCog(cogPath);
    } catch (error) {
        return ctx.send(`There was an error reloading your cog: ${error}`);
    };
    ctx.send(`Reloaded cog with path ${cogPath}`)

});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/applications
*/