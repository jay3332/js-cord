const { maybePromise, timeoutPromise } = require('../utils');
const { TimeoutError } = require('../errors/Errors');

/**
 * The base class that emits events and manages their callbacks.
 * {@link Client} extends this class.
 */
module.exports = class Emitter {
    constructor() {
        this.waiting = [];
        this.listeners = [];
        this.strictListeners = {};
    }

    /**
     * Adds a strict listener to your emitter.
     * @param {string} event The event to listen for.
     * @param {function} callback The callback for when the event is emitted.
     */
    on(event, callback) {
        this.strictListeners[event] = callback
    }

    /**
     * Listens for your event to be emitted only once.
     * @param {string} event The event to listen for.
     * @param {function} callback The callback for when the event is emitted.
     */
    once(event, callback) {
        this.listeners.push({
            _id: this.listeners.length,
            event: event,
            callback: callback,
            _count: 1
        });
    }

    /**
     * Adds a separate listener to your emitter.
     * Unlike {@link Emitter#on}, there can be multiple instances of these listeners.
     * 
     * @param {string} event The event to listen for.
     * @param {function} callback THe callback for when the event is emitted.
     */
    listen(event, callback) {
        this.listeners.push({
            _id: this.listeners.length,
            event: event,
            callback: callback
        })
    }

    getListenerByID(id) {
        return this.listeners.find(listener => listener._id == id);
    }

    removeListener(event, callback) {
        let found = this.listeners.find(l => l.event == event && l.callback == callback);
        if (!found) return;

        this.listeners.splice(this.listeners.indexOf(found), 1);
    }

    removeStrictListener(event) {
        delete this.strictListeners[event]
    }

    /**
     * Emits an event.
     * @param {string} event The event to emit.
     * @param  {...any} parameters The parameters to pass into the events' callbacks.
     */
    async emit(event, ...parameters) {
        let listeners = this.listeners.filter(listener => listener.event === event);
        if (!listeners) return;

        let strictListener = this.strictListeners[event];
        if (strictListener) await maybePromise(strictListener, ...parameters);

        for (let listener of listeners) {
            await maybePromise(listener.callback, ...parameters);
            if (listener._count) listener._count--;
        }

        this.listeners = this.listeners
            .filter(listener => (!listener._count) || (typeof listener._count === 'number' && listener._count > 0));
    }

    /**
     * Collects the payloads of events that are emitted.
     * @param {?object} options The options to use when collecting.
     * @param {?number} options.limit The maximum amount of events to collect.
     * @param {?number} options.timeout The amount of time in milliseconds to collect for. 
     * @param {?function} options.check The check function for each event collected.
     * @param {?boolean} options.suppress Whether or not to suppress timeout errors. 
     * @yields {any} The event emitted.
     */
    async *collect(event, { timeout, check, limit, suppress = true } = {}) {
        const stopAt = timeout ? (Date.now() + timeout) : null;
        let collected = 0;

        const stopCollecting = () => {
            if (stopAt && (Date.now() >= stopAt))
                return true;
            if (limit && (collected >= limit))
                return true; 
            return false;
        }

        while (true) {
            try {
                yield await timeoutPromise((
                    stopAt ? (
                        Math.max(0, stopAt - Date.now())
                    ) : -1 
                ), (resolve, reject) => {
                    if (stopCollecting()) {
                        reject(collected);
                        return;
                    }
            
                    const collect = (...args) => {
                        this.removeListener(event, collect);
                        if (check && !check(...args)) 
                            return;

                        if (stopCollecting())
                            reject(collected);

                        collected++;
                        resolve((args.length !== 1) ? args : args[0]);
                    }; 
        
                    this.listen(event, collect);
                }, () => new TimeoutError(`Collector timed out after ${timeout/1000} seconds.`));
            } catch (exc) {
                if (exc instanceof TimeoutError && suppress)
                    throw exc;
                break;
            }
        }
    }

    /**
     * Waits for an event to be emitted, then returns the payload.
     * @param {string} event The event to wait for to emit.
     * @param {?object} options The options to use when waiting.
     * @param {?function} options.check The check function for the event.
     * @param {?number} options.timeout The maximum amount of time to wait for the event to be emitted.
     * @returns {any} The event payload.
     */
    async waitFor(event, { check, timeout } = {}) {
        for await (let item of this.collect(event, { limit: 1, suppress: false, check, timeout })) {
            return item;
        }
    }
}