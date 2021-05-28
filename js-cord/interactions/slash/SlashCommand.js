const { parseSnowflake } = require('../../utils');
const SlashCommandOption = require('./SlashCommandOption');

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

    setName(name) {
        this.name = name;
        return this;
    }

    setDescription(description) {
        this.description = description;
        return this;
    }

    addOption(option) {
        if (typeof option === 'object') {
            option = new SlashCommandOption(option);
        }
        this.options.push(option);
        return this;
    }

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

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options.map(o => o.toJSON()),
            default_permission: this.defaultPermission
        };
    }
}