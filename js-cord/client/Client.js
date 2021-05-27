//const { Log, NoLog } = require('../loggers');
const { sum } = require('../utils');
const { InvalidToken } = require('../errors/Errors');
const Intents = require('../models/Intents');
const SnowflakeSet = require('../models/SnowflakeSet');
const HTTPClient = require('../core/HTTPClient');
const Websocket = require('../core/Websocket');
const Emitter = require('./Emitter');
const Guild = require('../models/Guild');


module.exports = class Client extends Emitter {
    #apiVersion;
    #gatewayVersion;

    constructor({ 
        allowedMentions,
        intents = Intents.default(), 
        apiVersion = 9,
        gatewayVersion = 9 } = {}
    ) {
        super();

        // if (!logger instanceof Log) 
        //     throw new TypeError('Invalid type for option "logger"');

        this.cache = {
            guilds: new SnowflakeSet(),
            channels: new SnowflakeSet(),
            users: new SnowflakeSet(),
            messages: new SnowflakeSet(),
            emojis: new SnowflakeSet(),
            roles: new SnowflakeSet()
        }

        this._components = [];
        this.allowedMentions = allowedMentions;
        this.intents = intents;

        this.loggedIn = false;
        this.logger = { log: (..._) => {} };
        this.http = undefined;
        this.ws = undefined;
        this.user = undefined;

        this.#apiVersion = apiVersion;
        this.#gatewayVersion = gatewayVersion;
    }

    get id() {
        return this.user?.id;
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
        this.http = new HTTPClient(this, this.apiVersion);
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
        return this.cache.users.get(id);
    }

    getGuild(id) {
        return this.cache.guilds.get(id);
    }

    getChannel(id) {
        return this.cache.channels.get(id);
    }

    getRole(id) {
        return this.cache.roles.get(id);
    }

    get users() {
        return this.cache.users.values();
    }

    get channels() {
        return this.cache.channels.values();
    }

    get guilds() {
        return this.cache.guilds.values();
    }

    get roles() {
        return this.cache.roles.values();
    }

    async fetchGuild(id) {
        const data = await this.http.getGuild(id);
        const guild = new Guild(this, data);
        this.cache.guilds.push(guild);
        return guild;
    }

    async createGuild(name) {
        const data = await this.http.createGuild(name);
        const guild = new Guild(this, data);
        this.cache.guilds.push(guild);
        return guild;
    }
}