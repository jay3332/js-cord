// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// An owner-only command with a check
bot.command({ name: "owner-only", check: new discord.Check(ctx => {
    // check if owner id's match
    const isOwner = (bot.owner_id == ctx.author.id);
    // send an error message if the check fails
    if (!isOwner) ctx.send("You need to be the bot owner to use this command!");
    // return the result
    return isOwner;
}, true /* The `silence` parameter (whether or not to silence the error if the check fails) */) }, ctx => {
    ctx.reply("Hello, owner!");
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/applications
*/