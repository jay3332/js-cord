const fs = require('fs');

class Log {
    log(_message) {}
    info(_message) {}
    warn(_message) {}
    error(error) {
        throw error;
    }
}

class ConsoleLog extends Log {
    #all;
    #action;

    constructor({ all = false }) {
        this.#all = all;
        this.#action = console.log;
    }

    log(message) {
        if (this.#all) 
            this.#action(`[LOG] ${message}`);
    }

    info(message) {
        this.#action(`[INFO] ${message}`)
    }

    warn(message) {
        this.#action(`[WARNING] ${message}`)
    }
}

class BasicLog extends ConsoleLog {
    #action;

    constructor(action = console.log, { ...options }) {
        super(...options);
        this.#action = action;
    }
}

class FileLog extends BasicLog {
    #file;

    constructor(file, { ...options }) {
        super(...options);
        this.#file = file;
    }

    #action(message) {
        fs.appendFile(this.#file, message, (err) => {
            if (err) this.error(err);
        });
    }
}

NoLog = new Log();

module.exports = { Log, NoLog, ConsoleLog, BasicLog, FileLog }
