// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// This command will take in 3 arguments.
bot.command("embed", (ctx, title, description, footer) => {

    // create the embed
    const embed = discord.Embed();
    embed.setTitle(title);
    embed.setDescription(description);
    embed.setFooter(footer);
    embed.setColor("random");

    // send the embed by passing in an Object rather than a direct String.
    ctx.send({embed: embed});
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/applications
*/