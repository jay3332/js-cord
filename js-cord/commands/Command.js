const { Check } = require('../commands/Check')

class Command {
    constructor(name, aliases, checks = [Check.none()], guildOnly=false, permissions=null, cooldown = Cooldown.none(), exec = ()=>{}, options={}, cog=null) {
        this.name = name;
        this.aliases = aliases;
        this.checks = checks;
        this.cooldown = null;
        this.guildOnly = guildOnly;
        this.permissions = permissions;
        this.exec = exec; 
        this.cog = cog;

        for (const option of Object.keys(options)) {
            if (!this.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }

        this.setCooldown(cooldown);
    }
    setCooldown(newCooldown) {
        if (!newCooldown instanceof Cooldown)
            throw Error('Your cooldown must be a discord.Cooldown object.');
        this.cooldown = newCooldown;
    }
    get execParams() {
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
        const ARGUMENT_NAMES = /([^\s,]+)/g;

        let fnStr = this.exec.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if(result === null) result = [];
        return result;
    }
    get signature() {
        /** 
         * Returns the signature / usage of the command, e.g.
         * <argument> [optional] [text...]
         */
        const parameters = this.execParams;
        let arr = [];

        for (parameter of parameters) {
            if (parameter.startsWith("...")) parameter = parameter.trim(".")+'...';
            arr.push(parameter.contains("=") ? `[${parameter}]`: `<${parameter}>`);
        }
        return arr.join(' ');
    }
}

module.exports = Command;