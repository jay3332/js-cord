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
Note that you must first **respond** to the interaction.  

## Button Styles
Discord (and js-cord) provides 5 different button styles for you choose from:
- primary (blurple)
- secondary (gray)
- success (green)
- danger (red)
- link

Each of these have an integer that corresponds with them. js-cord has built-in enumerations so that you don't have to go looking in the docs everytime you want to switch button styles.

You can access this enumeration via `discord.ButtonStyle`:
```sh
$ node
>>> const { ButtonStyle } = require('js-cord');
>>> ButtonStyle
{
    primary: 1,
    secondary: 2,
    success: 3,
    danger: 4,
    link: 5
}
```

To implement these into your buttons, add a `style` option for each button:
```js
const discord = require('js-cord');
const client = new discord.Client({ intents: discord.Intents.all() });

client.on('ready', () => {
    console.log(`Logged in as ${client.user}`);
});

client.on('message', async (message) => {
    const myComponents = new discord.Components()
        .addButton({ 
            label: 'A dangerous button', 
            style: discord.ButtonStyle.danger 
        }, async (interaction) => {
            // Respond to the interaction here.
            await interaction.respond(`${interaction.author.name} clicked the button.`);
        }); 
    await message.channel.send('Look at this button:', { components: myComponents }) 
});

client.login(process.env.TOKEN);
```
## Different types of responses
### Edit responses
It is possible respond to interactions by editing your message, rather than sending a new one.

To do so, set the `edit` option to `true`:
```js
await interaction.respond(`${interaction.author.name} clicked the button.`, { edit: true });
```
The `Interaction#edit` method is a shortcut to this.

### Ephemeral responses
You can make your response ephemeral - that is, allowing only the interaction author to see the response. 

Like the `edit` option, set `ephemeral` to `true`, like so:
```js
await interaction.respond(`${interaction.author.name} clicked the button.`, { ephemeral: true });
```

### Deferring responses
If your task takes a long time, you can defer your response, then respond later.  

Like the other options, set the `defer` option to `true`:
```js
await interaction.respond({ defer: true });

setTimeout(() => {
    interaction.respond(`${interaction.author.name} clicked the button.`);
}, 2000);
```