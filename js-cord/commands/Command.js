const { Check } = require('../commands/Check')

class Command {
    constructor(name, aliases, description, checks = [Check.none()], cooldown = Cooldown.none(), exec = ()=>{}) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.defaultCooldown = cooldown;
        this.exec = exec; 
    }
    setCooldown(newCooldown) {
        if (!newCooldown instanceof Cooldown)
            throw Error('Your cooldown must be a discord.Cooldown object.')
        this.defaultCooldown = newCooldown;
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
    }
}

module.exports = Command;