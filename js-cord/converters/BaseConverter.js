/**
 * The base converter for all converters.
 * Basically, all classes that extend this class will convert a string input into a structure.
 */

module.exports = class BaseConverter {
    constructor(...args) {
        this.convert(...args);
    }
    convert(...args) {
        return null;
    }
}