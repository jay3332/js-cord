const { maybePromise } = require('../utils');

module.exports = class Emitter {
    /**
     * The base class that emits events and manages their callbacks.
     * {@link Client} extends this class.
     */

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

    // async waitFor(event, check, timeout) {
    //     this.once(event, async (...args) => {
    //         if (!await check(...args)) return;

    //     });
    // } 

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
            .filter(listener => !listener._count || (typeof listener._count === 'number' && listener._count > 0));
    }
}