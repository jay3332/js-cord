class Util {
	constructor() {
		throw new Error(`You cannot create an instance of ${this.constructor.name}.`);
	};

    static parseAssetSize(size) {
        if (
            !size || typeof size !== 'number' ||
            isNaN(size) || size < 2 || size > 4096
        ) return false;
        return Math.log2(size) % 1 === 0;
    }

    static parseSnowflake(snowflake) {
        const epoch = 1420070400000;
        let binary = '';
        if (!['number', 'string', 'date'].includes(typeof snowflake) || !snowflake) return;
        snowflake = snowflake.toString()
        let high = parseInt(snowflake.slice(0, -10));
        let low = parseInt(snowflake.slice(-10));
        while (high > 0 || low > 0) {
            binary = String(low&1) + binary;
            low = Math.floor(low / 2);
            if (high > 0) {
                low += 5000000000 * (high % 2);
                high = Math.floor(high / 2);
            }
        }
        binary = binary.toString(2).padStart(64, '0');
        const unix = parseInt(binary.substring(0, 42), 2)+epoch;
        return new Date(unix);
    }

	static escapeMarkdown(text, {
		codeBlock = true, inlineCode = true, bold = true, italic = true, underline = true, strikethrough = true, spoiler = true,
	} = {}) {
		if (inlineCode) text = Util.escapeInlineCode(text);
		if (codeBlock) text = Util.escapeCodeBlock(text);
		if (italic) text = Util.escapeItalic(text);
		if (bold) text = Util.escapeBold(text);
		if (underline) text = Util.escapeUnderline(text);
		if (strikethrough) text = Util.escapeStrikethrough(text);
		if (spoiler) text = Util.escapeSpoiler(text);
		return text;
	};
	
	static escapeCodeBlock(text) {
		return text.replace(/```/g, '\\`\\`\\`')
	}
	static escapeInlineCode(text) {
		return text.replace(/[^\\]`/g, '\\`')
	}
	static escapeBold(text) {
		return text.replace(/\*\*/g, '\\*\\*')
	}
	static escapeItalic(text) {
		return text.replace(/[^\\]?\*/g, '\\*')
			.replace(/[^\\]_/g, '\\_')
	}
	static escapeUnderline(text) {
		return text.replace(/__/g, '\\_\\_')
	}
	static escapeStrikethrough(text) {
		return text.replace(/~~/g, '\\~\\~')
	}
	static escapeSpoiler(text) {
		return text.replace(/\|\|/g, '\\|\\|')
	}
}

module.exports = Util;