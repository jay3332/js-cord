const Bitfield = require('./Bitfield');

module.exports = class InvertedBitfield extends Bitfield {
    _set(other, toggle = true) {
        return super._set(other, !toggle);
    }
}