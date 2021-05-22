class Markdown {
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

	static hasInviteLink(text) {
		if (typeof text !== 'string') return false;
		const invRegex = /(https?:\/\/)?(discord\.gg|discord(app)?\.com\/invite)\/\w+/g;
		return !!text.match(invRegex);
	}
}


module.exports = {
    sleep: async (milliseconds) => {
        await new Promise(r => setTimeout(r, milliseconds));
    },

    parseSnowflake: (snowflake) => {
        const epoch = 1420070400000;
        let binary = '';
        try {
            snowflake = snowflake.toString()
            let high = parseInt(snowflake.slice(0, -10));
            let low = parseInt(snowflake.slice(-10));
            while (high > 0 || low > 0) {
                binary = String(low & 1) + binary;
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
        catch (_) {
            return false;
        }
    },

	escapeMarkdown: (text, {
		codeBlock = true, inlineCode = true, bold = true, italic = true, underline = true, strikethrough = true, spoiler = true,
	}) => {
		if (inlineCode) text = Markdown.escapeInlineCode(text);
		if (codeBlock) text = Markdown.escapeCodeBlock(text);
		if (italic) text = Markdown.escapeItalic(text);
		if (bold) text = Markdown.escapeBold(text);
		if (underline) text = Markdown.escapeUnderline(text);
		if (strikethrough) text = Markdown.escapeStrikethrough(text);
		if (spoiler) text = Markdown.escapeSpoiler(text);
		return text;
	}
}