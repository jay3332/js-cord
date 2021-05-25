const { NotImplementedError } = require("../../Errors")

module.exports = class Converter {
    async convert(ctx, argument) {
        throw new NotImplementedError(`This method must be overwritten.`)
    }
}