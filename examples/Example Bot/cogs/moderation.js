const discord = require("js-cord");

class Moderation extends discord.Cog {
    constructor(bot) {
        super(bot);
        this.bot = bot;
    }
    
    main() {

        this.listen("ready", () => {
            console.log(`Cog ${this.name} loaded.`);
        });

        this.command({
            name: "kick",
            aliases: ["remove", "k"],
            description: "Kicks a user from your server.",
            permissions: new discord.Permissions({ kickMembers: true }),
            guildOnly: true
        }, (ctx, ...member) => {
            if (!ctx.me.permissions.kickMembers) {
                return ctx.send("I don't have permissions to kick members.");
            }
            member = new discord.MemberConverter().convert(ctx.guild, member);
            if ((member.topRole.position >= ctx.author.topRole.position) && (!ctx.author.isOwner)) {
                return ctx.send("Your role is too low to kick that member.");
            }
            if (ctx.me.topRole.position <= member.topRole.position) {
                return ctx.send("My role is too low to kick that member.");
            }
            ctx.guild.kick(member, { reason: `Kicked by ${ctx.author}` });
            ctx.send(`Kicked **${member}**`);
        });

    }
}

module.exports = { cog: Moderation };