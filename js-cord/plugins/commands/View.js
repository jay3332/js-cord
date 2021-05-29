const { 
    QuoteParsingError,
    UnexpectedQuoteError,
    NoClosingQuoteError
 } = require('./Errors');

 
let defaultQuotes = {
    '"': '"',
    "'": "'"
}

let extendedQuotes = {
    '"': '"',
    "‘": "’",
    "‚": "‛",
    "“": "”",
    "„": "‟",
    "⹂": "⹂",
    "「": "」",
    "『": "』",
    "〝": "〞",
    "﹁": "﹂",
    "﹃": "﹄",
    "＂": "＂",
    "｢": "｣",
    "«": "»",
    "‹": "›",
    "《": "》",
    "〈": "〉"
}

/**
 * A utility class that helps parse words out of a string.
 */
class StringView {
    constructor(text, quotes = defaultQuotes) {
        text = text || '';

        /**
         * The text buffer of the view.
         * @type {string}
         */
        this.text = text;

        /**
         * The quote mapping of the view.
         * @type {object}
         */
        this.quotes = quotes;

        /**
         * The current index the view is on.
         * @type {number}
         */
        this.index = 0;

        /**
         * The previous character parsed.
         * @type {?string}
         */
        this.previous = null;
        
        /**
         * The length of the text. 
         * @type {number}
         */
        this.end = text.length
    }

    /**
     * Whether or not the view has finished parsing the string.
     * @type {boolean}
     */
    get eof() {
        return this.index >= this.end
    }

    /**
     * The current character at the view's index.
     * @type {?string}
     */
    get buffer() {
        return this.eof ? null : this.text[this.index]
    }

    get allQuotes() {
        return [
            ...Object.keys(this.quotes),
            ...Object.values(this.quotes)
        ];
    }

    /**
     * Reads one single character and returns it.
     * @returns {?string} The read character.
     */
    getChar() {
        let result = this.text[this.index + 1];
        this.previous = this.index++;
        return result;
    }

    /**
     * Rolls back to the previous index.
     */
    rollback() {
        this.index = this.previous;
    }

    /**
     * Reads the text until the end and returns the read characters.
     * @returns {string} The rest of the text.
     */
    getRest() {
        let result = this.text.slice(this.index);
        this.previous = this.index;
        this.index = this.end;
        return result;
    }

    _hasSpace(text) {
        return text.split('').every(char => ' \t\n\r'.includes(char))
    }

    /**
     * Reads until the next character is not a whitespace.
     * @returns {boolean} Whether or not a space was skipped.
     */
    skipSpace() {
        let current;
        let position = 0;
        while (!this.eof) {
            current = this.text[this.index + position];
            if (current == undefined) break;
            if (!this._hasSpace(current)) break;
            position++;
        }

        this.previous = this.index;
        this.index += position;
        return this.previous !== this.index;
    }

    _getWord() {
        let current = this.buffer;
        if (current == undefined) return null;

        let endQuote = this.quotes[current];
        let parsingQuote = !!endQuote;
        let result, escaped, next;

        if (parsingQuote) {
            result = [];
            escaped = [ current, endQuote ];
        } else {
            result = [ current ];
            escaped = this.allQuotes;
        }

        while (!this.eof) {
            current = this.getChar();
            if (!current) {
                if (parsingQuote) 
                    throw new NoClosingQuoteError(
                        `Expected an end quote (${endQuote}).`
                    ); 
                return result.join('');
            }

            if (current === '\\') {
                next = this.getChar();
                if (!next) {
                    if (parsingQuote) 
                        throw new NoClosingQuoteError(
                            `Expected an end quote (${endQuote}).`
                        ); 
                    return result.join('');
                }

                if (escaped.includes(next)) {
                    result.push(next);
                } else {
                    this.rollback();
                    result.push(current);
                }
                continue;
            }

            if (this.allQuotes.includes(current) && !parsingQuote) 
                throw new UnexpectedQuoteError(
                    `Did not expect quote at index ${this.index}`);

            if (parsingQuote && (current === endQuote)) {
                next = this.getChar();
                if (!((!next) || this._hasSpace(next))) {
                    throw new QuoteParsingError('Invalid quote string.');
                } 

                return result.join('')
            }

            if (this._hasSpace(current) && !parsingQuote) 
                return result.join('');
            
            result.push(current);
        }
    }

    /**
     * Reads the next word, or words in quotes, and returns it.
     * @param {object} options The options for parsing. 
     * @returns The parsed word.
     */
    getWord({ skipSpace = false } = {}) {
        let result = this._getWord();
        if (skipSpace) this.skipSpace();
        return result;
    }
}


/**
 * Represents a reversed {@link StringView}.
 * 
 * No support for quotes here, 
 * this was primarily made to get
 * a command from a string.
 */
class BasicReverseStringView {
    constructor(text) {
        this.text = text;
        this.index = text.length;
        this._started = false;
    }

    _hasSpace(text) {
        return text.split('').every(char => ' \t\n\r'.includes(char))
    }

    get eof() {
        return this.index <= 0;
    }

    getWord() {
        if (!this.started) {
            this.started = true;
            return this.text;
        }

        let current;
        while (!this.eof) {
            current = this.text[--this.index];
            if (this._hasSpace(current)) break;
        }
        return this.text.slice(0, this.index)
    }

    getRest() {
        return this.text.slice(this.index)
    }
}


module.exports = { StringView, BasicReverseStringView, defaultQuotes, extendedQuotes }
