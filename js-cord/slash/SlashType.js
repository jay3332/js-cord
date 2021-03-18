/**
 * Represents a slash command option (argument) type.
 * Available options:
 * @property SUB_COMMAND - A subcommand. (value: 1)
 * @property SUB_COMMAND_GROUP - A subcommand group. (value: 2)
 * @property STRING - A normal string of text. (value: 3)
 * @property INTEGER - An integer. (value: 4)
 * @property BOOLEAN - A boolean (true/false) (value: 5)
 * @property USER - A discord user. (value: 6)
 * @property CHANNEL - A channel. (value: 7)
 * @property ROLE - A role. (value: 8)
 */
module.exports = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,

    // aliases
    SUBCOMMAND: 1,
    SUBCOMMAND_GROUP: 2,
    NUMBER: 4,
    BOOL: 5,
    MEMBER: 6,
    INT: 4,
    STR: 3,
    SUB: 1,
    SUB_GROUP: 2,
}