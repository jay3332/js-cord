module.exports = class Queue {
    constructor() {
        this.promises = [];
    }

    get count() {
        return this.promises.length;
    }

    wait() {
        const next = this.count 
            ? this.promises[this.count-1].promise 
            : Promise.resolve();
        
        let resolve;
        const promise = new Promise(r => {
            resolve = r;
        });

        this.promises.push({resolve, promise});
        return next;
    }

    shift() {
        const shifted = this.promises.shift();
        if (typeof shifted !== 'undefined') shifted.resolve();
    }
}