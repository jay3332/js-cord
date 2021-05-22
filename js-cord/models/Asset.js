const { BadFormat } = require('../errors/Errors');
const { CDN_URL } = require('../constants');

const DEFAULT_VALID_FORMATS = [ 'png', 'jpg', 'jpeg', 'webp', 'gif' ];
const DEFAULT_VALID_SIZES   = [ 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096 ];

module.exports = class Asset {
    constructor(baseURL, hash, { validFormats = DEFAULT_VALID_FORMATS, validSizes = DEFAULT_VALID_SIZES, animated }) {
        this.#baseURL = CDN_URL + baseURL;
        this.#validFormats = validFormats;
        this.#validSizes = validSizes;
        this.#animated = animated;
        this.hash = hash;
    } 

    toString() {
        return this.url
    }

    get animated() {
        if (this.#animated == null)
            return this.hash.startsWith('a_');
        return this.#animated;
    }

    get defaultFormat() {
        return this.animated ? 'gif' : 'png'
    }

    get url() {
        return this.urlAs()
    }

    #assertFormat(format) {
        if (format.startsWith('.')) 
                format = format.slice(1,)
            format = format.toLowercase();

            if (!this.#validFormats.includes(format)) 
                throw new BadFormat(`Format '${format}' is invalid.`);
        return format;
    }

    get urlAs({ format, size, staticFormat }) {
        format = format ? this.#assertFormat(format) : this.defaultFormat;
        staticFormat = staticFormat ? this.#assertFormat(staticFormat) : this.defaultFormat;

        format = this.animated ? format : staticFormat;
        let url = `${this.#baseURL}/${hash}.${format}`;
        if (size) {
            if (!this.#validSizes.includes(size)) 
                throw new BadFormat(`Size '${size}' is invalid.`);
            url += `?size=${size}`
        }

        return url;
    }
}
