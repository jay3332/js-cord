// Import the library
const discord = require("js-cord");

// We will extend discord.CommandContext to make our custom context:
class CustomContext extends discord.CommandContext {
    constructor(...args) {
        super(...args);
        this.variable = "Hello, World!"; // custom variable
    }
}

// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// We will overwrite the default message listener in favor of our custom context.
bot.listen("message", message => {
    // Retrieve our context, and fill the `cls` parameter with our class
    const context = discord.CommandContext.parseContext(message, bot, CustomContext);
    if (!context) return;
    // Ignore bots
    if (context.author.bot) return;
    context.invoke();
})

// Test our context
bot.command("hello", ctx => {
    ctx.reply(ctx.variable);
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/applications
*/