const bitLengthOf = n => n.toString(2).match(/1/g).length;

module.exports = class Flags {
    /**
     * Represents a flag value
     */

    constructor(validFlags, defaultToAll=false) {
        this.value = defaultToAll ? 2**bitLengthOf(Math.max(Object.values(validFlags)))-1 : 0;
        this.FLAGS = validFlags;
    }

    hasValue(o) { return (this.value & o === o) }
    setValue(o, option) { if (option) this.value |= o; else this.value &= ~o }
}