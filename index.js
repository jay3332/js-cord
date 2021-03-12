/** 
 * For testing
 */

const discord = require('./js-cord');
const client = new discord.Client();

client.listen("ready", () => {
    console.log("this works");
});

client.login("token");