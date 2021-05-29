const { parseSnowflake } = require('../../utils');
const SlashCommandOption = require('./SlashCommandOption');

/**
 * Represents a slash command.
 * @param {string} name The name of the slash command.
 * @param {?object} options The options to use when creating the command. 
 */
module.exports = class SlashCommand {
    constructor(name, options = {}) {
        if (typeof name === 'object') {
            options = name;
        } else {
            options.name = name;
        }

        this.name = options.name;
        this.description = options.description || 'No description provided.';
        this.options = options.options || [];
        this.defaultPerimssion = options.defaultPermission;
    }

    /**
     * Sets the name of the slash command.
     * @param {string} name The slash command name.
     * @returns {SlashCommand}
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * Sets the description of the slash command.
     * @param {string} description The slash command description.
     * @returns {SlashCommand}
     */
    setDescription(description) {
        this.description = description;
        return this;
    }

    /**
     * Adds an option to the slash command.
     * @param {Object} option The option to add to the slash command.
     * @returns {SlashCommand}
     */
    addOption(option) {
        if (typeof option === 'object') {
            option = new SlashCommandOption(option);
        }
        this.options.push(option);
        return this;
    }

    /**
     * Creates a slash command object from JSON.
     * @static
     * @param {Object} options The JSON object to provide.
     * @returns {SlashCommand}
     */
    static fromJSON({
        id,
        application_id,
        name, 
        description,
        options = [],
        default_permission = true
    } = {}) {
        let cmd = new this();
        cmd.id = id;
        cmd.name = name;
        cmd.createdAt = parseSnowflake(id);
        cmd.applicationID = application_id;
        cmd.description = description;
        cmd.options = options.map(o => new SlashCommandOption(o));
        cmd.defaultPermission = default_permission;
        return cmd;
    }

    /**
     * Returns a JSON object representing this slash command.
     * @returns {Object}
     */
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options.map(o => o.toJSON()),
            default_permission: this.defaultPermission
        };
    }
}