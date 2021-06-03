/*
    Credit to Sapphire for this utility class.
    https://github.com/sapphiredev/utilities/blob/main/packages/async-queue/src/lib/AsyncQueue.ts

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software
    and associated documentation files (the “Software”), to deal in the Software without restriction, 
    including without limitation the rights to use, copy, modify, merge, publish, distribute,
    sublicense, and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies 
    or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, 
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES 
    OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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
