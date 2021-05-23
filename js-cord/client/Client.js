//const { Log, NoLog } = require('../loggers');
const { sum } = require('../utils');
const { InvalidToken } = require('../errors/Errors');
const Requester = require('../core/Requester');
const Websocket = require('../core/Websocket');
const Emitter = require('./Emitter')


module.exports = class Client extends Emitter {
    #apiVersion;
    #gatewayVersion;

    constructor({ apiVersion = 9, gatewayVersion = 9, /*logger = NoLog*/ } = {}) {
        super();

        // if (!logger instanceof Log) 
        //     throw new TypeError('Invalid type for option "logger"');

        this.cache = {
            guilds: [],
            channels: [],
            users: [],
            messages: [],
            emojis: []
        }

        this.loggedIn = false;
        this.logger = { log: (..._) => {} };
        this.http = undefined;
        this.ws = undefined;

        this.#apiVersion = apiVersion;
        this.#gatewayVersion = gatewayVersion;
    }

    get apiVersion() {
        return this.#apiVersion;
    }

    get gatewayVersion() {
        return this.#gatewayVersion;
    }

    get latency() {
        /**
         * Returns the bot's latency in milliseconds.
         */
        let latencies = this.ws.latencies;
        let lastThree = latencies.slice(-3);
        return (sum(lastThree) / lastThree.length) * 1000
    }

    #putToken(token) {
        if (!token) throw new InvalidToken('Token is undefined.');
        this.token = token;
    }

    #establishHTTP() {
        this.http = new Requester(this, this.apiVersion);
    }

    #establishWebsocket() {
        this.ws = new Websocket(this, this.gatewayVersion);
    }

    async start(token) {
        this.#putToken(token);
        this.#establishHTTP();
        this.#establishWebsocket();
        await this.ws.start();
    }

    login(token) {
        this.start(token).then();
    }

    getUser(id) {
        return this.cache.users.find(user => user.id == id);
    }

    getGuild(id) {
        return this.cache.guilds.find(guild => guild.id == id);
    }

    getChannel(id) {
        return this.cache.channels.find(channel => channel.id == id);
    }
}