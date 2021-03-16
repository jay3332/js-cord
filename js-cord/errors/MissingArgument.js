module.exports = class MissingArgument extends Error {
    constructor(arg) {
        this.arg = arg;
        super(`Missing required argument: ${arg.name}`);
    }
}