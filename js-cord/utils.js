class Markdown {
    static escapeCodeBlock(text) {
        return text.replace(/```/g, '\\`\\`\\`')
    }
    static escapeInlineCode(text) {
        return text.replace(/([^\\]?)`/g, '$1\\`')
    }
    static escapeBold(text) {
        return text.replace(/\*\*/g, '\\*\\*')
    }
    static escapeItalic(text) {
        return text.replace(/([^\\]?)\*/g, '$1\\*')
            .replace(/([^\\]?)_/g, '$1\\_')
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
        const invRegex = /(https?:\/\/)?(discord\.gg|discord(app)?\.com\/invite)\/\w+/;
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
        (a, b) => a + key(b), 0
    );
}

class BasePaginator {
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
        if (this.currentPage.length > (this.prefix == undefined ? 0 : 1)) {
            this.closePage();
        }
        return this._pages;
    }
}

class Paginator extends BasePaginator {
    constructor({
        prefix = '```',
        suffix = '```',
        maxSize = 2000,
        delimiter = '\n',
        forceWrap = true,
        includeWrapped = true
    } = {}) {
        if (!delimiter instanceof Array)
            delimiter = [delimiter];

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
            let search = line.slice(0, maxSize - 1);
            let wrapped = false;

            for (let delim of this.delimiters) {
                let position = search.lastIndexOf(delim);

                if (position > 0) {
                    super.addLine(line.slice(0, position), empty);
                    wrapped = true;

                    line = line.slice(
                        this.includeWrapped ?
                        position :
                        position + delim.length
                    );

                    break;
                }

                if (!wrapped) {
                    if (this.forceWrap) {
                        super.addLine(line.slice(0, maxSize - 1));
                        line = line.slice(maxSize - 1);
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

/**
 * General utility functions and classes.
 */
module.exports = {
    /**
     * Generates pages out of text.
     * Inspired by discord.py's pagination system.
     */
    BasePaginator,

    /**
     * Paginator that supports force wrapping and multiple delimiters.
     * This should be used over BasePaginator.
     * @extends BasePaginator
     */
    Paginator,

    /**
     * Emulates Python's `sum` function.
     * @param {Array<any>} array The array of items to sum. 
     * @param {?function} key The key to use when calculating the sum. 
     * @returns {any} The sum of the array.
     */
    sum,

    /**
     * Returns a promise that sleeps for the requested amount of time.
     * @param {number} milliseconds The amount of milliseconds to sleep for.
     * @return {Promise}
     */
    sleep: async (milliseconds) => {
        await new Promise(r => setTimeout(r, milliseconds));
    },

    /**
     * Generates a random number that has the given amount of bits.
     * @param {number} bits The amount of bits the number will have.
     * @returns {bigint} The generated number.
     */
    urandom: bits => {
        const b = Array.from({ length: bits }, () => Math.round(Math.random()).toString()).join('');
        return BigInt(b, 2);
    },

    /**
     * If the given function returns a {@link Promise}, return it. 
     * Else, turn it into one and return it.
     * @param {function} func The function to call.
     * @param  {...any} args The arguments to pass into the function. 
     * @returns {Promise<any>} 
     */
    maybePromise: async (func, ...args) => {
        let result = func(...args);
        if (result instanceof Promise)
            result = await result;
        return result;
    },

    /**
     * Parses an emoji string and returns the parsed object.
     * @param {string} emoji The emoji string to use. E.g. '<:blobpain:739614945045643447>'
     * @returns {object} The object with schema { name: string, id: ?string, animated, boolean }
     */
    parseEmoji: emoji => {
        const re = /<(?<animated>a?):(?<name>[a-zA-Z0-9_]{2,32}):(?<id>[0-9]{17,})>/;
        let groups = re.exec(emoji)?.groups;
        if (groups) {
            groups.animated = !!groups.animated;
            return groups;
        }
        return { name: emoji };
    },

    /**
     * Retrieves when a snowflake was created at.
     * @param {string} snowflake The snowflake to use.
     * @returns {Date} The date that represents the snowflake.
     */
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
        } catch {
            return false;
        }
    },

    escapeMarkdown: (text, {
        codeBlock = true,
        inlineCode = true,
        bold = true,
        italic = true,
        underline = true,
        strikethrough = true,
        spoiler = true,
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

    /**
     * indexOf, but for objects.
     * Provide a value, and this method will return it's key.
     * @param {object} object The object to use.
     * @param {any} value The value of the key.
     * @returns {any} The found key of the object.
     */
    index: (object, value) => {
        return Object.keys(object).find(k => object[k] === value);
    },

	/**
	 * Checks is a class is a subclass of the given class, 
	 * or any if given an array of classes.
	 * @param {class} cls The class to compare with.
	 * @param {class | class[]} checks The class to compare to. Can also be an array of classes.
	 * @returns {boolean} If the class is indeed a subclass of the class(es).
	 */
    isSubclass: (cls, checks) => {
        if (!(checks instanceof Array)) checks = [checks];
        return checks.some(c => cls.prototype instanceof c || cls === c);
    },

    /**
	 * Simulates the `range` method in Python.
	 * This returns a generator. You can turn it into an array via `[...range(...)]`
	 * 
	 * For example, range(2, 10, 2) will return a generator [ 2, 4, 6, 8 ], but not 10.
	 * @param {number} start The number to start with. Defaults to 0.
	 * @param {number} stop Represents when to stop generating.
	 * @param {number} step The increment per iteration. 
     * @yields {number} The current counter.
	 */
    range: function* (start, stop, step = 1) {
        if (stop == undefined) {
            stop = start;
            start = 0;
        }
        let number = start;
        while (number < stop) {
            yield number;
            number += step;
        }
    },

    /**
     * Similar to Python's built-in `enumerate` method. 
     * @param {generator} gen The generator to use. 
     * @param {number} start The starting number. Defaults to 0. 
     * @yields {Array<number, any>} The paired number with it's object.
     */
    enumerate: function* (gen, start = 0) {
        let number = start;
        for (let thing in gen) {
            yield [number++, thing];
        }
    },

    /**
     * Escapes special regex characters from a pattern.
     * @param {string} literalString The string to escape.
     * @returns {string} The resulting escaped characters.
     */
    regexEscape: (literalString) => {
        return literalString.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
    },

    /**
     * Gets the current process time in milliseconds.
     * This should be used over `Date#getTime`.
     * @type {number}
     */
    get time() {
        return parseFloat(process.hrtime().join('.')) * 1000
    },

    /**
     * Returns a [pseudo]random integer given the range.
     * @param {number} min The minimum number, inclusive.
     * @param {number} max The maximum number, also inclusive.
     * @return {number} The number chosen.
     */
    randint(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    timeoutPromise(timeout, callback, error) {
        error = error ||
            (t => new Error(`Promise timed out after ${t} milliseconds.`));

        if (timeout <= -1) return new Promise(callback); 

        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(error(timeout));
            }, timeout);
    
            callback(
                value => {
                    clearTimeout(timer);
                    resolve(value);
                },
                error => {
                    clearTimeout(timer);
                    reject(error);
                }
            );
        });
    }
}