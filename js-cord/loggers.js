const fs = require('fs');

module.exports = {
    Log: class {
        log(_message) {}
        info(_message) {}
        warn(_message) {}
        error(error) {
            throw error;
        }
    },
    
    NoLog: new this.Log(),
    ConsoleLog: class extends Log {
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
    },
    BasicLog: class extends ConsoleLog {
        constructor({ action = console.log, ...options }) {
            super(...options);
            this.#action = action;
        }
    },
    FileLog: class extends BasicLog {
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
}
