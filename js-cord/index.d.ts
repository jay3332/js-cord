type Awaited<T> = T | Promise<T>;

type json = any[] | object;

declare module "js-cord" {
    import * as ws from 'ws';

    export class Asset {
        constructor(baseURL: string, hash: string, options: AssetPropertyOptions);
        public animated: boolean;
        public defaultFormat: 'gif' | 'png';
        public hash: string;
        public url: string;
        public toString(): string;
        public urlAs(options: AssetOptions): string;

        private _animated: boolean;
        private _baseURL: string;
        private _validFormats: string[];
        private _validSizes: number[];

        #assertFormat(format: string): string | never;
    }
    
    interface AssetPropertyOptions {
        validFormats: string[];
        validSizes: number[];
        animated: boolean;
    }

    interface AssetOptions {
        format: string;
        size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
        staticFormat: string;
    }

    export class Bitfield {
        constructor(value?: bigint);
        public value: bigint;
        public toString(): string;
        public static fromObject(object?: object, mapping?: object): Bitfield;

        private __load(mapping: object): void;
        private _has(other: bigint): boolean;
        private _set(other: bigint): bigint;
    }

    export class Client extends Emitter {
        constructor(options: ClientOptions);
        public token: string;
        public cache: ClientCache;
        public sharded: boolean;
        public intents: Intents;
        public allowedMentions: object;
        public loggedIn: boolean;
        public logger: object;
        public http: HTTPClient | null;
        public ws: Websocket | null;
        public user: ClientUser | null;
        public shards: Websocket[];
        public apiVersion: number;
        public gatewayVersion: number;
        public readonly latency: number;
        public readonly latencies: number[];

        private _connection: Connection;
        private _shardCount: number | null;
        private _shards: Websocket[];
        
        #apiVersion: number;
        #gatewayVersion: number;
        #putToken(token: string): void;
    }

    interface ClientCache {
        guilds: SnowflakeSet,
        channels: SnowflakeSet,
        users: SnowflakeSet,
        messages: SnowflakeSet,
        emojis: SnowflakeSet,
        roles: SnowflakeSet,
        commands: SnowflakeSet
    }
    
    interface ClientOptions {
        allowedMentions?: object,
        intents?: Intents,
        apiVersion?: number,
        gatewayVersion?: number,
        shard?: boolean,
        shardCount?: number | null
    }
    
    export class ClientUser extends User {
        public locale: string;
        public mfaEnabled: boolean;
        public verified: boolean;
    }
    
    interface CollectOptions {
        timeout?: number;
        check?: (...args: any[]) => boolean;
        limit?: number;
        suppress?: boolean;
    }

    export class Connection {
        constructor(http?: HTTPClient, ws?: Websocket);
        
        public cache: ClientCache;
        public http?: HTTPClient;
        public ws?: Websocket;
        
        private _slash: any[];
        private _components: any[];
        private _dropdownOpts: any[];
    }
    
    export class DiscordObject {
        constructor(id: Snowflake);
        public createdAt: Date;
        public id: Snowflake;
        equals(other: DiscordObject): boolean;
    }

    export class Emitter {
        public listeners: Listener[];
        public strictListeners: { [ index: string ]: ListenerCallback };
        public collect(event: string, options: CollectOptions): AsyncGenerator<any, never, any>;
        public emit(event: string, ...parameters: any[]): Promise<void>;
        public getListenerByID(id: number): Listener;
        public listen(event: string, callback: ListenerCallback): void;
        public on(event: string, callback: ListenerCallback): void;
        public once(event: string, callback: ListenerCallback): void;
        public removeListener(event: string, callback: ListenerCallback): void;
        public removeStrictListener(event: string): void;
        public waitFor(event: string, options: WaitForOptions): Promise<any>;
    }

    export class HTTPClient {
        constructor(client: Client, v?: number);
        public token: string;
        public userAgent: string;
        public addReaction(destinationID: Snowflake, messageID: Snowflake, emoji: json): Promise<json>;
        public createGlobalSlashCommand(payload: json): Promise<json>;
        public createGuild(name: string): Promise<json>;
        public createGuildChannel(guildID: Snowflake, payload: object): Promise<json>;
        public createGuildSlashCommand(guildID: Snowflake, payload: json): Promise<json>;
        public createMessage(destinationID: Snowflake, payload: json): Promise<json>;
        public deleteGuild(guildID: Snowflake): Promise<json>;
        public deleteMessage(destinationID: Snowflake, messageID: Snowflake): Promise<json>;
        public editGuild(guildID: Snowflake, payload: json): Promise<json>;
        public editGuildChannelPositions(guildID: Snowflake, payload: json): Promise<json>;
        public editMessage(destinationID: Snowflake, messageID: Snowflake, payload: json): Promise<json>;
        public getClientInformation(): Promise<json>;
        public getConnectionInfo(): Promise<json>;
        public getGuild(guildID: Snowflake): Promise<json>;
        public getGuildChannels(guildID: Snowflake): Promise<json>;
        public getMember(guildID: Snowflake, userID: Snowflake): Promise<json>;
        public getMembers(guildID: Snowflake): Promise<json>;
        public getReactionUsers(destinationID: Snowflake, messageID: Snowflake, emoji: json, options: json): Promise<json>;
        public getRecommendedShardCount(): Promise<number>;
        public logout(): Promise<json>;
        public request(route: string, payload: json, contentType?: string): Promise<json>;
        public respondToInteraction(id: Snowflake, token: string, type: number, payload: json): Promise<json>;
        public route(...args: string[]): Route;

        private _encodeEmoji(data: json): string;
        private _oldRequest(route: string, payload: json, contentType?: string): Promise<json>;

        #apiVersion;
    }

    export class Intents extends Bitfield {
        constructor(value?: bigint);
        public static all(): Intents;
        public static fromObject(object?: object): Intents;
        public static default(): Intents;
        public static none(): Intents;
    }

    interface Listener {
        _id: number,
        event: string,
        callback: ListenerCallback,
        _count?: number
    }

    type ListenerCallback = (...args: any[]) => Awaited<any>;

    export class Route {
        constructor(v: number, method?: string, route?: string);
        public baseURL: string;
        public method: string;
        public route: string;
        public url: string;
    }

    type Snowflake = `${bigint}`;

    export class SnowflakeSet extends Map<Snowflake, DiscordObject> {
        public push(...objects: DiscordObject[]): void;
        public filter(predicate: (obj: DiscordObject) => boolean): DiscordObject[];
        public find(predicate: (obj: DiscordObject) => boolean): DiscordObject | undefined;
    }

    export class User extends DiscordObject {
        constructor(client: Client, data: unknown);
        public avatar: Asset;
        public avatarAnimated: boolean;
        public avatarURL: string;
        public bot: boolean;
        public defaultFormat?: string;
        public discriminator: string;
        public displayName: string;
        public mention: string;
        public name: string;
        public system: boolean;
        public tag: string;
        public avatarUrlAs(options: AssetOptions): string;
        public toString(): string;

        private client: Client;
        private rawData: unknown;
        private loadData(data: unknown): void;
    }

    interface WaitForOptions {
        check?: (...args: any[]) => boolean;
        timeout?: number;
    }

    export class Websocket {
        constructor(client: Client, v?: number, shardID?: number);
        public client: Client;
        public id: number;
        public lastPing: number | null;
        public latencies: number[];
        public latency: number;
        public sequence: number | null;
        public sessionID: number | null;
        public shardID: number;
        public socketURL: string;
        public ws?: ws;
        public doHeartbeat(): Promise<void>;
        public processWebsocketData(rawData: unknown): Promise<void>;
        public send(...args: any[]): Promise<void>;
        public setupWebsocket(): Promise<void>;
        public start(): Promise<void>;

        #gatewayVersion: number;
        #started: boolean;
    }
}
