# Introduction to js-cord's commands plugin
Every normal bot has some kind of "command" system.  
In js-cord, implementing this kind of system is made easy with the built-in commands plugin.
## Why use the commands plugin?
Without the commands plugin, commands would have to be made manually.  
This is an example of a beginner's command handler:
```js
const discord = require('js-cord');
const client = new discord.Client();
const prefix = '!';

client.on('message', async (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
    case "ping":
        await msg.channel.send('Pong!');
        break;
    // so on...
    }
});

client.login(process.env.TOKEN)
```
As you can see, although this is relatively clean when we have one command, it's gonna get a bit messy once our bot reaches - let's say, 100 commands. Not to mention the pain it would be to go and update your help command every single time your add a new command... Yuck.
## Using the commands plugin
Let's switch to the commands plugin.  
It was designed to be full in features, and easily extendable.  
Here's an example of the right way to make commands in js-cord:
```js
const discord = require('js-cord');
const commands = discord.plugins.commands;
const bot = new commands.Bot({ prefix: '!' });

bot.command('ping', async (ctx) => {
    await ctx.send('Pong!')
});

client.login(process.env.TOKEN)
```
This looks a lot more efficient. And clean, of course.
## What is "ctx"?
"ctx" in the examples are just parameter names that represent the context of the command.  
For example, you can access the user who invoked the command via `ctx.author`, or the message that contained the command via `ctx.message`. It is there so that you don't have to provide a s\*\*tload of parameters into every command's callback.

This context is of type `commands.Context`. You can extend this class and pass it in as an option in the bot constructor: 
```js
const discord = require('js-cord');
const commands = discord.plugins.commands;

class MyCustomContext extends commands.Context {
    constructor(...args) {
        super(...args);
        this.myCustomVariable = 2;
    }
}

const bot = new commands.Bot({
    prefix: '$',
    contextClass: MyCustomContext 
});

bot.command('my-custom-variable', async (ctx) => {
    await ctx.send(`Your custom variable is ${ctx.myCustomVariable}`)
});

bot.login(process.env.TOKEN)
```