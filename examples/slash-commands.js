const discord = require('../js-cord');
const client = new discord.Client({ intents: discord.Intents.all() });

client.on('message', async (msg) => {
    if (msg.content === 'create a slash command') {
        let command = new discord.SlashCommand()
            .setName('my-slash-command')
            .setDescription('This is a slash command.')
            .addOption({ name: 'option', type: 'string', description: 'This is an option.' });

        msg.guild.createSlashCommand(command, async (ctx, { test = "You didn't provide an option." } = {}) => {
            await ctx.respond(`Hello ${ctx.author}, ${test}`, { ephemeral: true });
        });
    }
});

client.login(process.env.TOKEN);