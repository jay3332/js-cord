![js-cord](https://i.ibb.co/80WHs6W/js-cord-banner-transparent.png)
# js-cord
js-cord is a wrapper around the Discord API, written and to be used in Javascript.
## Why was this created?
I've always liked JavaScript's syntax better than Python's, but I tend to use Python more for developing Discord Bots because the API wrapper for Python (discord.py) has more features than the conventional discord.js. This wrapper fixes that, with built in command managers, cooldown managers, a built in argument parsing system, and much more.
## Features
+ 100% API coverage
+ Built-in command handler
    + Advanced argument parsing
    + Flag parsing
+ Voice receive/send support
+ Slash command support
+ Webhook support
## Useful Links
+ [Repository](https://github.com/jay3332/js-cord)
+ [Documentation](https://jay3332.github.io/js-cord)
+ [Discord Server](https://discord.gg/R6pY3FWh3A)
+ [Trello](https://trello.com/b/unTW6EpW/js-cord)
## Installation
Installing js-cord is pretty easy with `npm`:
```
npm install js-cord
```
Or, if you want the latest version, clone this repository using git:
```
npm install git+https://github.com/jay3332/js-cord
```
## Examples
#### Here is a simple ping-pong bot made using js-cord:
```js
// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
});

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
#### Argument parsing and embeds in js-cord:
```js
// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
});

// This command will take in 3 arguments.
bot.command("embed", (ctx, title, description, footer) => {

    // create the embed
    const embed = new discord.Embed();
    embed.setTitle(title);
    embed.setDescription(description);
    embed.setFooter(footer);
    embed.setColor("random");

    // send the embed by passing in an Object rather than a direct String.
    ctx.send({ embed: embed });
});

// Log in to Discord.
bot.login("token");
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/developers/applications
*/
```
#### Consume-rest argument behavior in js-cord:
```js
// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = new discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
});

// This command will take one argument, but it requires spaces.
// This consume rest behavior fixes this.
bot.command("say", (ctx, ...text) => {
    ctx.send(text);
});

// Log in to Discord.
bot.login("token");
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/developers/applications
*/
```
## Slash Commands
I personally dislike slash commands due to their harsh limitations and lack of customization. I've decided to add support for them however, to guarantee complete coverage of Discord's API.
#### Here's an example of a slash command:
```js
// currently, we haven't decided this yet
```
## Ending it off
You can join our [support server](https://discord.gg/R6pY3FWh3A) for help - or consider reading our [docs](https://jay3332.github.io/js-cord/) for reference.  
You can also take a look at the [examples folder](https://github.com/jay3332/js-cord/tree/master/examples) for examples using js-cord.
## Credits
#### Developers
Main developer: [jay3332](https://github.com/jay3332)  
Contributors: [Cats3153](https://github.com/Cats3153)

#### Inspired By
+ [discord.py](https://github.com/Rapptz/discord.py) - Idea for command handlers  
+ [discord.js](https://github.com/discordjs/discord.js) - Used as reference for websockets  
+ [discord.js Commando](https://github.com/discordjs/Commando/) - Idea for (advanced) argument parsing
