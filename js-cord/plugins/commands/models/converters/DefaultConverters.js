const { BadArgument } = require('../../Errors');
const Converter = require('./Converter');

module.exports = {
    StringConverter: class extends Converter {
        async convert(_, argument) {
            return argument;
        }
    },
    NumberConverter: class extends Converter {
        async convert(_, argument) {
            let result = parseFloat(argument);
            if (isNaN(result)) {
                throw new BadArgument(`Could not convert "${argument}" to a number.`)
            }
            return result;
        }
    },
    IntegerConverter: class extends Converter {
        async convert(_, argument) {
            let result = parseInt(argument);
            if (isNaN(result)) {
                throw new BadArgument(`Could not convert "${argument}" to an integer.`)
            }
            return result;
        }
    },
    BigIntConverter: class extends Converter {
        async convert(_, argument) {
            try {
                return BigInt(argument);
            } catch (exc) {
                if (exc instanceof SyntaxError) 
                    throw new BadArgument(`Could not convert "${argument}" to a BigInt.`);
                return;
            }
        }
    },
    BooleanConverter: class extends Converter {
        async convert(_, argument) {
            const True = ['true', 't', 'yes', 'y', '1', 'enable', 'enabled', 'on'];
            const False = ['false', 'f', 'no', 'n', '0', 'disable', 'disabled', 'off'];
            const lowered = argument.toLowerCase();

            if (True.includes(lowered)) return true;
            else if (False.includes(lowered)) return false;
            else {
                throw new BadArgument(`Could not convert "${argument}" to a boolean.`)
            }
        }
    }
}