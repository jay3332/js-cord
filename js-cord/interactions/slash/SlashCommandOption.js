const { SlashCommandOptionType } = require('../../enums');

/**
 * Represents a slash command option.
 */
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

    /**
     * Adds a choice for the user to pick.
     * @param {string} name The choice name shown to the user.
     * @param {string} value The choice value given to the bot.
     * @returns {SlashCommandOption}
     */
    addChoice(name, value) {
        if (typeof name === 'object') {
            value = name.value;
            name = name.name;
        }

        this.choices.push({ name: name, value: value });
        return this;
    }

    /**
     * Adds an option.
     * @param {Object} option The option to add.
     * @returns {SlashCommandOption}
     */
    addOption(option) {
        if (typeof option === 'object') {
            option = new this.constructor(option);
        }
        this.options.push(option);
        return this;
    }

    /**
     * Returns a JSON object representing this slash command option.
     * @returns {Object}
     */
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

    /**
     * If the option is optional.
     * @type {boolean}
     */
    get optional() {
        return !this.required;
    }

    set optional(value) {
        this.required = !value;
    }
}