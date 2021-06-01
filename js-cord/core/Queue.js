/**
 * A sequentializing utility class used to efficiently manage promises.
 */
module.exports = class Queue {
    constructor() {
        this.promises = [];
    }

    /**
     * The amount of queued promises.
     */
    get count() {
        return this.promises.length;
    }

    /**
     * Waits for the last promise to complete and queues a new one.
     * @returns {?Promise<any>} The promise that was queued.
     */
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

    /**
     * Unlocks the queue for the next promise.
     */
    shift() {
        const shifted = this.promises.shift();
        if (typeof shifted !== 'undefined') shifted.resolve();
    }
}