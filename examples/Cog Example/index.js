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
bot.addExtension("./my_cog");

// We can reload cogs to update them, without having to completely restart our bot.
bot.command({ name: "reload", check: discord.Check.ownerOnly() }, (ctx, ...cogPath) => {
    try {
        bot.reloadExtension(cogPath);
    } catch (error) {
        return ctx.send(`There was an error reloading your cog: ${error}`);
    };
    ctx.send(`Reloaded cog with path ${cogPath}`)

});

// We can also try getting a cog by it's name:
// Here is a command that sends a list of commands given a specific cog.
bot.command("viewcog", (ctx, ...cogName) => {
    const cog = bot.getCog(cogName); // Note: This is case-sensitive
    if (!cog) /* Returns undefined if the cog isn't found */ {
        return ctx.send("Unknown cog.");
    }
    const commands = cog.commands; // Returns an Array of discord.Command objects.
    const commandNames = commands.map(cmd => cmd.name); // We want the names of the commands
    ctx.send(commandNames.join(", ")); // Send the command names, joined by a comma
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/applications
*/