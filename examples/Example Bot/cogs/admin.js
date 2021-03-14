const discord = require("js-cord");

class Admin {
    constructor(bot) {
        super(bot);
        this.bot = bot;
        this.check = discord.Check.ownerOnly();
    }
    main() {
        
        this.listen("ready", () => {
            console.log(`Cog ${this.name} loaded.`);
        });

        this.command({
            name: "eval", 
            aliases: ["e", "exec", "execute"],
            description: "Evaluates a block of code."
        }, (ctx, ...code) => {
            let res = eval(code);
            ctx.send(res);
        });

        this.command({
            name: "logout",
            alias: "shutdown",
            description: "Logs bot out of Discord."
        }, ctx => {
            let original = ctx.send("Are you sure you want to log me out?");
            original.addReactions([ "✅", "❌" ]);
            try {
                let payload = this.bot.waitFor("reactionAdd", (reaction, user) => {
                    return (user == ctx.author) 
                    && (["✅", "❌"].includes(reaction.emoji.toString()))
                    && (reaction.message == message);
                }, { timeout: 60000 })
            } catch (err) {
                if (err instanceof discord.WaitForTimeoutError) {
                    original.edit("Cancelled.");
                    return;
                }
            };
            let response = payload[0];
            if (response.emoji.toString() == "✅") {
                original.edit("Goodbye...");
                return this.bot.logout();
            }
            original.edit("Cancelled.");

        });

    }
}

module.exports = { cog: Admin };