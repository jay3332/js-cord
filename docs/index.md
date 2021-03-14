# Welcome
Welcome to the official documentation of js-cord. You can search for a doc entry by using `Ctrl+F`.
For extra support, consider reading the **[source](https://github.com/jay3332/js-cord)** or joining the **[support server](https://google.com)**.

> *I've always liked JavaScript's syntax better than Python's, but I tend to use Python more for developing Discord Bots because the API wrapper for Python (discord.py) has more features than the conventional discord.js. This wrapper fixes that, with built in command managers, cooldown managers, a built in argument parsing system, and much more.*

# Installation
Installing js-cord is pretty easy with `npm`:
```
npm install js-cord
```
Or, if you want the latest version, clone this repository using `git`:
```
npm install git+https://github.com/jay3332/js-cord
```

# Examples
Here are some examples of discord bots made using js-cord. 
You can retrieve your bot token **[here](https://discord.com/developers/applications)**.
All of these examples, plus a few more can be found **[here](https://github.com/jay3332/js-cord/tree/master/examples)**.

### Ping-pong
Simple ping-pong bot made using this js-cord.
```js
// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// Basic ping command
bot.command("ping", ctx => {
    ctx.reply("Pong!");
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/developers/applications
*/
```

### Embeds and arguments
This example shows the use of embeds and argument parsing:
```js
  
// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// This command will take in 3 arguments.
bot.command("embed", (ctx, title, description, footer) => {

    // create the embed
    const embed = new discord.Embed();
    embed.setTitle(title);
    embed.setDescription(description);
    embed.setFooter(footer);
    embed.setColor("random");

    // send the embed by passing in an Object rather than a direct String.
    ctx.send({embed: embed});
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/developers/applications
*/
```
## Want more?
A lot more examples can be found **[here](https://github.com/jay3332/js-cord/tree/master/examples)**.

# Documentation

### Client
###### *class*  `new discord.Client(options)`
Represents a client connection to Discord. If your application requires the use of commands, consider using [`Bot`](/#Bot), which extends this class.
#### Constructor parameters
[`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `options` (optional) - The options for the client connection:
`allowedMentions` ([`AllowedMentions`](/#AllowedMentions), optional) - Sets the allowed mentions for the client. Defaults to [`AllowedMentions.default()`](/#AllowedMentions.default) 

`intents` ([`Intents`](/#Intents), optional) - The intents that you want for the connection. Defaults to [`Intents.default()`](/#Intents.default)
#### Properties
#### Methods
###### `listen(event, exec)`
Listens for an event to be emitted. 
