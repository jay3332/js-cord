const { NotImplementedError } = require("../../Errors")

/**
 * The base converter class for the commands plugin.
 */
module.exports = class Converter {
    /**
     * Converts an argument to a specific class.
     * @param {Context} ctx
     * @param {string} argument The argument provided by the user.
     */
    async convert(ctx, argument) {
        throw new NotImplementedError(`This method must be overwritten.`)
    }
}