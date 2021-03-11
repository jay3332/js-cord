export class Util {
	constructor() {
		throw Error(`You cannot create an instance of ${this.constructor.name}.`);
	};

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
	
	static escapeCodeBlock(text)
		return text.replace(/```/g, '\\`\\`\\`')
	static escapeInlineCode(text)
		return text.replace(/[^\\]`/g, '\\`')
	static escapeBold(text)
		return text.replace(/\*\*/g, '\\*\\*')
	static escapeItalic(text)
		return text.replace(/[^\\]?\*/g, '\\*')
			.replace(/[^\\]_/g, '\\_')
	static escapeUnderline(text)
		return text.replace(/__/g, '\\_\\_')
	static escapeStrikethrough(text)
		return text.replace(/~~/g, '\\~\\~')
	static escapeSpoiler(text)
		return text.replace(/\|\|/g, '\\|\\|')
}