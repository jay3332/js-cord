const discord = require('js-cord');
const client = new discord.Client();

client.on('ready', () => {
    // Do ready stuff here
    console.log(`Logged in as ${client.user}`)
})

client.on('message', async (message) => {
    // Do whatever you want with the message here
    if (message.content === 'ping') {
        await message.reply('Pong!');
    }
});

client.login(process.env.TOKEN);