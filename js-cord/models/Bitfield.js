/**
 * The base class that represents a bitfield.
 */
module.exports = class Bitfield {
    constructor(value = 0) {
        if (typeof value !== 'bigint') 
            value = BigInt(value);

        /**
         * The integer value of the current bits.
         * @type {number}
         */
        this.value = value;
    }

    /**
     * From mapping keys to their bit values, 
     * this will create a {@link Bitfield} out of them.
     * @param {?object} object The object to use.
     * @param {object} mapping The mapping to use.
     * @returns {Bitfield} The created bitfield.
     */
    static fromObject(object = {}, mapping = {}) {
        let bitfield = new this();
        for (let key of Object.keys(mapping)) {
            bitfield[key] = !!object[key];
        }
        return bitfield;
    }

    __load(mapping) {
        for (let [ key, value ] of Object.entries(mapping)) {
            if (typeof value !== 'bigint')
                value = BigInt(value);
            Object.defineProperty(this, key, {
                get: () => this._has(value),
                set: toggle => this._set(value, toggle)
            });
        }
    }

    _has(other) {
        return (this.value & other) === other;
    }

    _set(other, toggle = true) {
        switch (toggle) {
        case true:
            this.value |= other;
            break;
        case false:
            this.value &= ~other;
            break;
        default:
            throw new TypeError('Toggle must be a boolean.');
        }
        return this.value;
    }

    toString() {
        return this.value.toString()
    }
}