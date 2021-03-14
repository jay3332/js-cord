// Import the library
const discord = require("js-cord");

// Create a cog. This will extend discord.Cog.
class MathCog extends discord.Cog /* This is the name of your cog. */ {
    // Create a constructor class that takes in a `bot` parameter:
    constructor(bot) {
        // Call the superclass before doing anything.
        super(bot);

        // [optional] Change the cog's name. Won't change the class name, only the cog name.
        this.name = "Math"; 

        // Add a `bot` attribute to this object so we can use it in our commands.
        this.bot = bot;
    }

    // Create a main function,
    // This will be where all of your commands are stored.
    main() {
        
        // A command in this cog
        this.command("add", (ctx, first, second) => {
            const result = parseInt(first) + parseInt(second);
            ctx.reply(`${first} + ${second} is ${result}.`);
        });

        // Another command in this cog
        this.command("subtract", (ctx, first, second) => {
            const result = parseInt(first) - parseInt(second);
            ctx.reply(`${first} - ${second} is ${result}.`);
        });

        // You can add listeners in cogs:
        // Note: Cog listeners listen for all events, regardless of which cog emits it - 
        // however they do not overwrite other listeners that are in other cogs.
        this.listen("message", message => {
            if (message.author.bot) return;
            if (!message.content) return;
            console.log(`[${message.author}] ${message.content}`);
        });
    }
}

// Make sure you add it in your module exports, strictly with the following format: module.exports = { cog: MathCog }; 

// Custom setup functions (note: either choose what's below or the line above. Don't use both.)
// If you don't add a setup function, it will default to `bot => Cog(bot)`
function setup(bot) {
    return MathCog(bot);
}

// Add it in your module exports.
module.exports = { cog: MathCog, setup: setup };