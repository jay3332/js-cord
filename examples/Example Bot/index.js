/**
 * This is a full example bot made in js-cord.
 * Note that explanation comments won't be included here.
 */

const discord = require("js-cord");

const OPTIONS = {
    prefix: "!",
    prefixCaseInsensitive: true,
    commandsCaseInsensitive: true,
    allowedMentions: discord.AllowedMentions.fromArray(["users", "roles"]),
    intents: discord.Intents.all(),
    shard: true // If your bot is small, set this to false
}

const bot = new discord.Bot(OPTIONS);
const token = process.env.TOKEN; // Add a TOKEN environment variable that is assigned to your bot's token.

bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
});

bot.command({
    name: "reload",
    alias: "rl",
    description: "Reloads a cog.",
    check: discord.Check.ownerOnly(true)
}, (ctx, ...path) => {
    let original = ctx.send("Reloading cog...");
    try {
        bot.reloadCog(path);
    } catch(err) {
        return ctx.send(`Error reloading ${path}: \`\`\`\n${err}\`\`\``);
    }
    original.edit(`Successfully reloaded \`${path}\`.`);
});

const EXTENSIONS = [
    "./cogs/admin",
    "./cogs/moderation",
    "./cogs/utility"
];
for (const extension of EXTENSIONS) {
    bot.loadExtension(extension);
}

bot.run(token);