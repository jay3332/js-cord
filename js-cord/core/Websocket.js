const { DiscordError } = require("../errors/Errors");
const EventEmitter = require('../client/Events');
const ws = require('ws');

module.exports = class Websocket {
    #gatewayVersion;
    #started;

    constructor(client, v=9) {
        if (!client.http) 
            throw new DiscordError('Cannot retrieve sufficient information (No valid HTTP connection.)');

        this.client = client;
        this.#gatewayVersion = v;
        this.latencies = [];
        this.lastPing = null;
        this.sequence = null;
        this.sessionID = null;
        this.#started = false;
        this.ws = undefined;
    }

    async send(...args) {
        await this.client.emit('websocketRawSend', ...args);
        await this.ws.send(...args);
    }

    async start() {
        if (this.#started) 
            throw new DiscordError('Gateway has already been started.');
        let socketURL = await this.client.http.getConnectInformation();
        socketURL = socketURL.url;
        socketURL += `?v=${this.#gatewayVersion}&encoding=json`;
        this.ws = new ws(socketURL);
        await this.setupWebsocket();
    }

    async setupWebsocket() {
        this.ws.on('message', async (data) => {
            if (typeof data !== "object") 
                data = JSON.parse(data);

            await this.client.emit('websocketRawReceive', data);
            await this.processWebsocketData(data);
        });
    }

    async doHeartbeat() {
        this.lastPing = parseFloat(process.hrtime().join("."));
        await this.send(JSON.stringify({
            op: 1,
            d: this.sequence
        }));
    }

    async processWebsocketData(rawData) {
        if (!rawData) return;
        const data = rawData.d;
        const op = parseInt(rawData.op);
        
        if (op === 0) {
            // it's an event
            this.sequence = rawData.s || this.sequence;
            await this.client.emit('gatewayEventReceive', rawData.t, data);
            await EventEmitter(this.client, rawData.t, data)
        } else if (op == 1) {
            // it's a heartbeat, we should send one back.
            // we should also start timing:
            this.lastPing = parseFloat(process.hrtime().join("."));
            this.send(JSON.stringify({
                op: 1, sequence: rawData
            }));
        } else if (op == 10) {
            await this.doHeartbeat();
            await this.send(JSON.stringify({
                op: 2,
                d: {
                    token: this.client.token,
                    intents: Number(this.client.intents.value),
                    properties: {
                        "$os": "linux",
                        '$browser': "js-cord",
                        '$device': "js-cord"
                    }
                }
            }));

            setInterval(async() => await this.doHeartbeat(), data.heartbeat_interval);
        } else if (op == 11) {
            // nice, we got a heartbeat ack, this means things went well.
            if (this.lastPing) {
                let current = parseFloat(process.hrtime().join("."));
                this.latencies.push(current - this.lastPing);
            }
        }
    }
}
