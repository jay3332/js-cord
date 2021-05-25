const { DiscordError } = require('../../errors/Errors');

class CommandError extends DiscordError {};
class ArgumentParsingError extends CommandError {};
class BadArgument extends ArgumentParsingError {};
class QuoteParsingError extends ArgumentParsingError {};
class ConversionError extends ArgumentParsingError {
    constructor(original) {
        super(original);
        this.original = original;
    }
};

module.exports = {
    CommandError,
    ArgumentParsingError,
    QuoteParsingError,
    ConversionError,
    BadArgument,
    CommandNotFound: class extends CommandError {
        constructor(query) {
            super(`Command '${query.replace(/'/g, "\\'")}' not found.`);
            this.query = query;
        }
    },
    ConstructionError: class extends CommandError {},
    NotImplementedError: class extends CommandError {},
    NoClosingQuoteError: class extends QuoteParsingError {},
    UnexpectedQuoteError: class extends QuoteParsingError {},
    ValidationError: class extends ConversionError {},
    
    MissingRequiredArgument: class extends ArgumentParsingError {
        constructor(arg) {
            super(`You are missing the "${arg.name}" argument, which is required.`);
            this.argument = arg;
        }
    },

    MemberNotFound: class extends BadArgument {
        constructor(arg) {
            super(`Member "${arg}" not found.`);
            this.argument = arg;
        }
    },
    UserNotFound: class extends BadArgument {
        constructor(arg) {
            super(`User "${arg}" not found.`);
            this.argument = arg;
        }
    }
}
