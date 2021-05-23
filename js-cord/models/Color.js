module.exports = class Color {
    constructor(value) {
        this.value = value;
    }

    #getByte(byte) {
        return (this.value >> (8 * byte)) & 0xff
    }

    static random() {
        return // wip
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

    static seaGreen() {
        return new Color(0x34eb8f);
    }
}