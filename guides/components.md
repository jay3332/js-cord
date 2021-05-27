# Message components in js-cord
A realtively new feature of Discord are components, which are quote:
> A framework for adding interactive elements to the messages your app or bot sends. They're accessible, customizable, and easy to use.

js-cord has full support for components, and here we'll guide you through on how you can implement it into your bot.

## Setting up your bot
We will assume that you already have a bot that can log-on, made using js-cord.  
Make sure your token is stored inside of your `.env` with key `TOKEN`.

We will use the following as our base code:
```js
const discord = require('js-cord');
const client = new discord.Client({ intents: discord.Intents.all() });

client.on('ready', () => {
    console.log(`Logged in as ${client.user}`);
});

client.on('message', async (message) => {
    // code here...
});

client.login(process.env.TOKEN);
```

## Sending buttons
Buttons are a type of message component.  
From Discord's documentation:
>  Buttons are interactive components that render on messages. They can be clicked by users, and send an interaction to your app when clicked. 

You can read more about buttons [here](https://discord.com/developers/docs/interactions/message-components#buttons).

In js-cord, you would send a message with buttons the normal way that you would with any other message. Just add a `components` option, that corresponds with a `Components` object.

You must add a button to your `Components` object (duh).
```js
const discord = require('js-cord');
const client = new discord.Client({ intents: discord.Intents.all() });

client.on('ready', () => {
    console.log(`Logged in as ${client.user}`);
});

client.on('message', async (message) => {
    const myComponents = new discord.Components()
        .addButton({ label: 'My first button' });  // Add the button here
    await message.channel.send('Look at this button:', { components: myComponents }) 
});

client.login(process.env.TOKEN);
```
![preview](https://cdn.discordapp.com/attachments/821519668300218398/847601354306617385/unknown.png)

## Responding to clicks
You've sent a button, but it's just a button. It doesn't do anything.  
Let's add a callback for when the button is clicked.

```js
const discord = require('js-cord');
const client = new discord.Client({ intents: discord.Intents.all() });

client.on('ready', () => {
    console.log(`Logged in as ${client.user}`);
});

client.on('message', async (message) => {
    const myComponents = new discord.Components()
        .addButton({ label: 'My first button' }, async (interaction) => {
            // Respond to the interaction here.
            await interaction.respond(`${interaction.author.name} clicked the button.`);
        }); 
    await message.channel.send('Look at this button:', { components: myComponents }) 
});

client.login(process.env.TOKEN);
```
Note that you must __respond__ to the interaction.