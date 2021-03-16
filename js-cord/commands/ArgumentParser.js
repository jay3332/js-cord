const validQuotes = {
    // this is from discord.py's source: (only the validQuotes)
    // https://github.com/Rapptz/discord.py/blob/7836046621d6b670730217ad4de321ef3ecd5cff/discord/ext/commands/view.py#L30
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

function parseQuotes(rawArgumentString, consumption, array) {
    const _ = rawArgumentString;
    let cPointer = 0;
    let pointer = 0;
    let buffer = "";
    let arrBuffer = [];
    let parsingQuote = false;
    let startQuote;
    let endQuote;
    let result = [];
    let consumptionsLeft = consumption[cPointer];

    for (let char of _) {
        if (!parsingQuote) {
            if (Object.keys(validQuotes).includes(char) && _[pointer-1]!="\\") {
                parsingQuote = true;
                startQuote = char;
                endQuote = validQuotes[char];
            } if (!parsingQuote) {
                if (char.match(/[\s\n]/)) {
                    if (consumptionsLeft>0) {
                        consumptionsLeft--;
                        if (!array[cPointer]) buffer += char;
                        else {
                            arrBuffer.append(buffer);
                        }
                    } if (consumptionsLeft<=0) {
                        cPointer++;
                        let consumptionsLeft = consumption[cPointer];
                        result.push(buffer);
                        buffer = "";
                    }
                } else {
                    buffer += char;
                }
            }
        } else {
            if (char===endQuote && _[pointer-1]!="\\") {
                parsingQuote = false;
            } else {
                buffer += char;
            }
        }
        pointer++;
    }
    return result
}

function parseArgsV2(ctx, rawArgumentString) {
    let rawArgs = parseQuotes(rawArgumentString);
    let commandArgs = ctx.command.args;
    // Parse/check the following:
    // Argument consumption:
    //   Negative numbers mean until the last _ index.
    //   These are always one more than the convention slice indcies.
    //   A consumption of -1 means consuming until the end.
    // Argument type conversion:
    //   Should raise an error should it fail to convert
    // Argument validation:
    //   This is done after parsing. Should raise an error if it fails the validation
    // Array consumption:
    //   Instead of the conventional string, it will return an array of the type instead.
    //   This will only work as (usually) intended if the consumption is more than 1. (or negative)
    let buffer = [];
    let argPointer = 0;
    let pointer = 0;
    let args = [];
    let commandArg;

    for (let arg of rawArgs) {
        commandArg = commandArgs[argPointer];
        // consumption
        
    }
    
}

module.exports = function parseArgs(ctx, rawArgumentString) {
    const _ = rawArgumentString;

    let commandArgs = ctx.command.args;
    if (!commandArgs.length) return [];
    let pointer = 0;
    let args = [];
    let arrBuffer = [];
    let buffer = "";
    let argPointer = 0;
    let currentArg;
    let parsingQuote = false;

    let previousChar;
    let startQuote;
    let endQuote;
    let argConsumptionsLeft;

    if (commandArgs[argPointer]) argConsumptionsLeft = commandArgs[argPointer].consume;

    for (let char of _) {

        currentArg = commandArgs[argPointer];
        if (!currentArg) break;

        if (argConsumptionsLeft === -1) {
            if (currentArg.array) {
                args.push(_.slice(pointer)).trim();
                break;
            }
        }

        if (!parsingQuote) {
            if (Object.keys(validQuotes).includes(char)) {
                previousChar = _[pointer-1];
                if (previousChar != "\\") {
                    startQuote = char;
                    endQuote = validQuotes[char];
                    parsingQuote = true;
                }
            }
            if (!parsingQuote) {
                if (char.match(/[\s\n]/)) {
                    if (argConsumptionsLeft>0) {
                        if (currentArg.array) {
                            buffer += char;
                            arrBuffer.push(buffer);
                            buffer = ""
                        } else {
                            buffer += char;
                        }
                        argConsumptionsLeft--;
                    }
                    if (argConsumptionsLeft<=0) { 
                        if (currentArg.array) {
                            args.push(arrBuffer);
                            arrBuffer = [];
                            buffer = "";
                            argPointer++;
                            argConsumptionsLeft = commandArgs[argPointer].consume;
                        }
                    }
                }
                else {
                    buffer += char;
                }
            }
        } else {
            if (char===endQuote && !_[pointer-1]==="//") {
                this.parsingQuote = false;
                if (argConsumptionsLeft>0) {
                        if (currentArg.array) {
                            arrBuffer.push(buffer);
                            buffer = ""
                        } else {
                            buffer += char;
                        }
                        argConsumptionsLeft--;
                    }
                    if (argConsumptionsLeft<=0) { 
                        if (currentArg.array) {
                            args.push(arrBuffer);
                            arrBuffer = [];
                            buffer = "";
                            argPointer++;
                            argConsumptionsLeft = commandArgs[argPointer].consume;
                        }
                    } 
            } else {
                buffer += char;
            }
        }
        pointer++;
    }
    let argBuffer = {};
    let result;
    for (const [i, a] of commandArgs.entries()) { 
        if (!a.optional) result = a.type(args[i]);
        else {
            try {
                result = a.type(args[i]);
            } catch (err) {
                if (!a.default) continue;
                result = a.default;
            }
        }
        if (a.validate) { 
            if ( a.validate(result) )
                argBuffer[a.name] = result;
            else {
                throw new Error("Argument did not pass validation.")
            }
        } else argBuffer[a.name] = result;
    }
    return argBuffer;
}