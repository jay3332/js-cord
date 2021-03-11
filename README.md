# js-cord
js-cord is a wrapper around the Discord API, written and to be used in Javascript.
## Why was this created?
I've always liked Javascript's syntax better than Python's, but I tend to use Python more for Discord Bot because the API wrapper for Python (discord.py) has more features than the conventional discord.js. This wrapper fixes that, with built in command managers, cooldown managers, a built in argument parsing system, and much more.
## Installation
Instally js-cord is pretty easy with `npm`:
```
npm install js-cord
```
Or, if you want the lastest version, clone it from git:
```
npm install git+https://github.com/jay3332/js-cord
```
## Examples
#### Here is a simple ping-pong bot made using js-cord:
```js
// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = discord.Bot({ prefix: "!" });

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
 * https://discord.com/applications
*/
```
#### Argument parsing and embeds in js-cord:
```js
// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// This command will take in 3 arguments.
bot.command("embed", (ctx, title, description, footer) => {

    // create the embed
    const embed = discord.Embed();
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
 * https://discord.com/applications
*/
```
#### Consume-rest argument behavior in js-cord:
```js
// Import the library
const discord = require("js-cord");
// Declare your bot
const bot = discord.Bot({ prefix: "!" });

// Notify us in the console when the bot is ready
bot.listen("ready", () => {
    console.log(`Logged in as ${bot.user}`);
})

// This command will take one argument, but it requires spaces.
// This consume rest behavior fixes this.
bot.command("say", (ctx, ...text) => {
    ctx.send(text);
});

// Log in to Discord.
bot.login("token"); 
/**
 * Your token is found on the Bot tab of your bot's application page.
 * https://discord.com/applications
*/
```
## Ending it off
Currently, we don't have a support server - consider reading our [docs](https://google.com/) for reference.

You can also take a look at the `examples` folder for examples using js-cord.
