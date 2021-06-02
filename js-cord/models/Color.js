const colorsys = require('colorsys');

/**
 * Represents a color.
 * @param {?number} value The decimal representation of this color.
 */
module.exports = class Color {
    constructor(value) {
        this.value = value;
    }

    getByte(byte) {
        return (this.value >> (8 * byte)) & 0xff
    }

    /**
     * The decimal amount of red.
     * @type {number}
     */
    get r() {
        return this.getByte(2);
    }

    /**
     * The decimal amount of green.
     * @type {number}
     */
    get g() {
        return this.getByte(1);
    }

    /**
     * The decimal amount of blue.
     * @type {number}
     */
    get b() {
        return this.getByte(0);
    }

    /**
     * The hex code representing this color.
     * @type {string}
     */
    get hex() {
        let raw = this.value.toString(16);
        return '0'.repeat(6 - raw.length) + raw;
    }

    /**
     * Returns an array of R, G, and B.
     * @returns {number[]}
     */
    toRGB() {
        return [ this.r, this.g, this.b ];
    }

    /**
     * Returns an array of H, S, and V.
     * @returns {number[]}
     */
    toHSV() {
        let rgb = this.toRGB();
        rgb = { r: rgb[0], g: rgb[1], b: rgb[2] };
        return Object.values(colorsys.rgb2Hsv(rgb));
    }

    /**
     * Creates a color object from RGB.
     * @static
     * @param {number} r The amount of red.
     * @param {number} g The amount of green.
     * @param {number} b The amount of blue.
     * @returns {Color}
     */
    static fromRGB(r, g, b) {
        return new Color((r << 16) + (g << 8) + b);
    }

    /**
     * Creates a color object from HSV.
     * @static
     * @param {number} h The hue.
     * @param {number} s The saturation.
     * @param {number} v The value.
     * @returns {Color}
     */
    static fromHSV(h, s, v) {
        let hsv = { h: h, s: s, v: v };
        return new Color.fromRGB(...Object.values(colorsys.hsv2Rgb(hsv)));
    }

    /**
     * Creates a color object from hex.
     * @static
     * @param {string} hex The hex color.
     * @returns {Color}
     */
    static fromHex(hex) {
        if (hex.startsWith('#')) 
            hex = hex.slice(1,);

        else if (hex.startsWith('0x'))
            hex = hex.slice(2,);

        return new Color(parseInt(hex, 16));
    }

    /**
     * The default color. (black)
     * @static
     * @returns {Color}
     */
    static default() {
        return new Color(0);
    }

    /**
     * Generates a random color.
     * @static
     * @returns {Color}
     */
    static random() {
        let hue = Math.floor(Math.random() * 360);
        return Color.fromHSV(hue, 100, 100);
    }

    /**
     * Generates a true random color.
     * @static
     * @returns {Color}
     */
    static trueRandom() {
        let value = Math.floor(Math.random() * (256 ** 3 - 1));
        return new Color(value);
    }

    static red() {
        return new Color(0xff0000);
    }

    static orange() {
        return new Color(0xff8000);
    }

    static yellow() {
        return new Color(0xffff00);
    }

    static lime() {
        return new Color(0x00ff00);
    }

    static cyan() {
        return new Color(0x00ffff);
    }

    static blue() {
        return new Color(0x0000ff);
    }

    static purple() {
        return new Color(0x8000ff);
    }

    static pink() {
        return new Color(0xccaaff);
    }

    static green() {
        return new Color(0x009200);
    }

    static lightBlue() {
        return new Color(0x00aaff);
    }

    static skyBlue() {
        return new Color(0x88ccff);
    }

    static ogBlurple() {
        return new Color(0x7289da);
    }

    static blurple() {
        return new Color(0x5865f2);
    }

    static greyple() {
        return new Color(0x99aab5);
    }

    static darkButNotBlack() {
        return new Color(0x2c2f33);
    }

    static notQuiteBlack() {
        return new Color(0x23272a);
    }

    static black() {
        return new Color(0x010101);
    }

    static white() {
        return new Color(0xffffff);
    }

    static fullWhite() {
        return Color.white();
    }

    static actuallyBlack() {
        return Color.black();
    }

    static brandGreen() {
        return new Color(0x57f287);
    }

    static brandRed() {
        return new Color(0xed4245);
    }

    static brandYellow() {
        return new Color(0xfee75c);
    }

    static brandBlack() {
        return Color.notQuiteBlack();
    }

    static fuchsia() {
        return new Color(0xeb459e);
    }

    static seaGreen() {
        return new Color(0x34eb8f);
    }

    static lightGray() {
        return new Color(0xb3b3b3);
    }

    static gray() {
        return new Color(0x808080);
    }

    static darkGray() {
        return new Color(0x4b4b4b);
    }

    static jetBlack() {
        return new Color(0x292929);
    }

    static gold() {
        return new Color(0xd6b027);
    }
}