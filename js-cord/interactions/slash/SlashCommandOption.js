const { SlashCommandOptionType } = require('../../enums');

module.exports = class SlashCommandOption {
    constructor({
        type,
        name,
        description,
        required = false,
        choices = [],
        options = []
    } = {}) {
        if (typeof type === 'string') {
            type = SlashCommandOptionType[type.toLowerCase()];
        }
        this.type = type;
        this.name = name;
        this.description = description;
        this.required = required;
        this.choices = choices;
        
        this.options = options.some(o => o instanceof this.constructor)
            ? options : options.map(o => new this.constructor(o));
    }

    addChoice(name, value) {
        if (typeof name === 'object') {
             value = name.value;
             name = name.name;
        }

        this.choices.push({ name: name, value: value });
        return this
    }

    addOption(option) {
        if (typeof option === 'object') {
            option = new this.constructor(option);
        }
        this.options.push(option);
        return this
    }

    toJSON() {
        return {
            type: this.type ?? 3,
            name: this.name,
            description: this.description,
            required: this.required ?? false,
            choices: this.choices.length 
                ? this.choices 
                : undefined,
            options: this.options.length
                ? this.options.map(o => o.toJSON())
                : undefined
        }
    }

    get optional() {
        return !this.required;
    }

    set optional(value) {
        this.required = !value;
    }
}