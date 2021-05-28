const { Components } = discord = require('../js-cord');
const client = new discord.Client({ intents: discord.Intents.all() });

let old = 0;
let score = 0;
let clickers = {};
let instanceRunning = false;

client.on('message', async (msg) => {
    if (msg.content === 'buttons, please') {
        if (instanceRunning) {
            return await ctx.send('Instance already running.')
        }

        instanceRunning = true;
        let c = new Components()
            .addButton({ label: 'Click me!' }, async (interaction) => {
                score++; 
                if (!clickers[interaction.author.id])
                    clickers[interaction.author.id] = 0;
                
                clickers[interaction.author.id]++;
                await interaction.respond('👍', { ephemeral: true })
            });

        let m = await msg.channel.send('Click this button', { components: c });

        setInterval(() => {
            if (score > old) {
                old = score;
                let biggest = [ '1', 0 ];
                for (let [ k, v ] of Object.entries(clickers)) {
                    if (v > biggest[1]) biggest = [ k, v ];
                }
                let topClicker = `<@!${biggest[0]}> (${biggest[1]} clicks)`;
                m.edit(`Click this button\nScore: ${score}\nTop clicker: ${topClicker}`);
            }
        }, 2000);
    }
});

client.login(process.env.TOKEN);