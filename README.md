![js-cord](https://i.ibb.co/80WHs6W/js-cord-banner-transparent.png)

<h1 align="center">
js-cord
</h1>
<p align="center">
<sup>
An API wrapper for Discord, made using Javascript.
</sup>
</p>

----

## Why js-cord?
I've always liked JavaScript's syntax better than Python's, but I tend to use Python more for developing Discord Bots because the API wrapper for Python (discord.py) has more features than the conventional discord.js. This wrapper fixes that, with built in command handling, pagination, debugging, and so much more.

## Note
You are currently looking at the rewrite branch, or the newer but unfinished branch of js-cord.  
The old but stable branch can be found [here](https://github.com/jay3332/js-cord/tree/master).

## Table of Contents
+ [Useful Links](#useful-links)
+ [Features](#features)
+ [Installation](#installation)
+ [Examples](#examples)
+ [Ending it off](#ending-it-off)
+ [Credits](#credits)

## Useful Links
+ [Guides](https://github.com/jay3332/js-cord/tree/rewrite/guides)
+ [Repository](https://github.com/jay3332/js-cord)
+ [Documentation](https://jay3332.github.io/js-cord)
+ [Help Server](https://discord.gg/R6pY3FWh3A)

## Features
<sup>It is obvious that this all isn't true. These are what we plan for js-cord to achieve.</sup>

+ 100% API coverage
    - Discord interaction support
        - Slash commands, message components
    - Voice send/receive support
    - Easy to use webhook support
+ Extensive [documentation](https://jay3332.github.io/js-cord)
+ Built-in plugins
    - Advanced command handing
        - Easy to implement built-in commands
        - Argument and flag parsing
        - Easy error handling
    - Menus and paginators

## Installation
You can install js-cord using `npm`:
```sh
$ npm install js-cord
```
Or, if you want the latest features, clone this repository directly:
```sh
$ npm install git+https://github.com/jay3332/js-cord
```

## Examples
In all of these examples, we assume you have already created a bot and have it's token ready.  
### Basic Bot
```js
const discord = require('js-cord');
const client = new discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user}`)
});

client.on('message', async (msg) => {
    if (msg.content === 'ping')) {
        await msg.reply('Pong!');
    }
});

client.login(process.env.TOKEN);
```
### Built-in command handler
```js
// Can also be accessed via discord.plugins.commands
const { plugins: { commands } } = require('js-cord');
const bot = new commands.Bot({ prefix: '$' });

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user}`);
});

bot.command('ping', async (ctx) => {
    await ctx.reply('Pong!');
});

bot.login(process.env.TOKEN);
```

## Ending it off
You can join our [support server](https://discord.gg/R6pY3FWh3A) for help - or consider reading our [docs](https://jay3332.github.io/js-cord/) for reference.  

There are also plenty of [guides](https://github.com/jay3332/js-cord/tree/rewrite/guides) on certain topics.

## Credits
#### Contributors
##### Owner:
- [jay3332](https://github.com/jay3332)  
##### Contributors:
- [Cats3153](https://github.com/Cats3153)
- [MrKomodoDragon](https://github.com/MrKomodoDragon)
