module.exports = class Emitter {
    constructor() {
        this.listeners = [];
    }

    on(event, callback) {
        this.listeners.push({
            _id: this.listeners.length,
            event: event,
            callback: callback
        })
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
        this.on(event, callback);
    }

    getListenerByID(id) {
        return this.listeners.find(listener => listener._id == id);
    }

    async emit(event, ...parameters) {
        let listeners = this.listeners.filter(listener => listener.event === event);
        if (!listeners) return;

        for (let listener of listeners) {
            await listener.callback(...parameters);
            if (listener._count) listener._count--;
        }

        this.listeners = this.listeners
            .filter(listener => !listener._count || (typeof listener._count === 'number' && listener._count > 0));
    }
}