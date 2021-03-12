// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// Wait for a reaction
bot.command("thumbs", ctx => {
    const message = ctx.reply("Thumbs up or thumbs down?");
    try {
        const response = bot.waitFor("reactionAdd", (reaction, user) => {
            return (["👍", "👎"].includes(reaction.emoji.toString()) && user==ctx.author)
        }, { timeout: 60000 /* Time in milliseconds */ });
    } catch (error) {
        if (error instanceof discord.WaitForTimeoutError) {
            return ctx.send("You didn't respond >:(");
        } else throw error;
    } const reaction = response[0];
    if (reaction.emoji.toString() === "👍") ctx.send("I agree");
    else if (reaction.emoji.toString() === "👎") ctx.send("I disagree");
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/applications
*/