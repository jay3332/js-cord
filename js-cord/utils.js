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

	static removeInviteLinks(text, repl) {
		const invRegex = /(https?:\/\/)?(discord\.gg|discord(app)?\.com\/invite)\/\w+/g;
		return text.replace(invRegex, repl);
	}
}


function sum(array, key) {
	key = key || (i => i);
	return array.reduce(
		(a, b) => key(a) + key(b), 0
	);
}


class BasePaginator {
	/**
	 * Generates pages out of text.
	 * Inspired by discord.py's pagination system.
	 */

	constructor({
		prefix = '```', 
		suffix = '```', 
		maxSize = 2000, 
		delimiter = '\n'
	} = {}) {
		this.prefix = prefix;
		this.suffix = suffix;
		this.maxSize = maxSize;
		this.delimiter = delimiter;
		this.clear();
	}

	resetPage() {
		if (this.prefix != undefined) {
			this.currentPage = [this.prefix];
			this.count = this.prefix.length + this.delimiter.length;
		} else {
			this.currentPage = [];
			this.count = 0;
		}
	}

	clear() {
		this.resetPage();
		this._pages = [];
	}

	addLine(line = '', empty = false) {
		let maxSize = this.maxSize - this.prefix.length - this.suffix.length;
		maxSize -= this.delimiter.length * 2;
		
		if (line.length > maxSize) throw new RangeError('Line is too large.');

		if (this.count + line.length + this.delimiter.length > 
			this.maxSize - this.suffix.length) this.closePage();

		this.count += line.length + this.delimiter.length;
		this.currentPage.push(line);

		if (empty) {
			this.currentPage.push('');
			this.count += this.delimiter.length;
		}
	}

	addLines(lines) {
		lines.forEach(this.addLine);
	}

	closePage() {
		if (this.suffix != undefined) 
			this.currentPage.push(this.suffix);
		this._pages.push(this.currentPage.join(this.delimiter));
		this.resetPage();
	}

	get length() {
		return sum(this._pages, page => page.length) + this.count;
	}

	get pages() {
		if(this.currentPage.length > (this.prefix == undefined ? 0 : 1)) {
			this.closePage();
		}
		return this._pages;
	}
}


class Paginator extends BasePaginator {
	/**
	 * Paginator that supports force wrapping and multiple delimiters.
	 * This should be used over BasePaginator.
	 */
	constructor({
		prefix = '```',
		suffix = '```', 
		maxSize = 2000, 
		delimiter = '\n',
		forceWrap = true,
		includeWrapped = true
	} = {}) {
		if (!delimiter instanceof Array) 
			delimiter = [ delimiter ];

		super({
			prefix: prefix,
			suffix: suffix,
			maxSize: maxSize,
			delimiter: delimiter[0]
		});

		this.delimiters = delimiter;
		this.forceWrap = forceWrap;
		this.includeWrapped = includeWrapped;
	}

	addLine(line = '', empty = false) {
		let maxSize = this.maxSize - this.prefix.length - this.suffix.length - 2;

		while (line.length > maxSize) {
			let search = line.slice(0, maxSize-1);
			let wrapped = false;

			for (let delim of this.delimiters) {
				let position = search.lastIndexOf(delim);
				
				if (position > 0) {
					super.addLine(line.slice(0, position), empty);
					wrapped = true;

					line = line.slice(
						this.includeWrapped 
							? position 
							: position + delim.length
					);

					break;
				}

				if (!wrapped) {
					if (this.forceWrap) {
						super.addLine(line.slice(0, maxSize-1));
						line = line.slice(maxSize-1);
					} else {
						throw new RangeError('Line was too large to wrap.');
					}
				}
			}
		}

		super.addLine(line, empty);
	}

	addLines(lines) {
		lines.forEach(this.addLine);
	}
}


module.exports = {
	BasePaginator, 
	Paginator,

	sum,
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
            const unix = parseInt(binary.substring(0, 42), 2) + epoch;
            return new Date(unix);
        }
        catch {
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
	},

	index: (object, value) => {
		return Object.keys(object).find(k => object[k] === value);
	}
}