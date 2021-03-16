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

    let validQuotes = {
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
        result = a.type(args[i]);
        if ( a.validate(result) )
            argBuffer[a.name] = result;
        else {
            throw new Error("Argument did not pass validation.")
        }
    }
    return argBuffer;
}