const { maybePromise } = require('../utils');

module.exports = class Emitter {
    constructor() {
        this.listeners = [];
        this.strictListeners = {};
    }

    on(event, callback) {
        this.strictListeners[event] = callback
    }

    once(event, callback) {
        this.listeners.push({
            _id: this.listeners.length,
            event: event,
            callback: callback,
            _count: 1
        });
    }

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