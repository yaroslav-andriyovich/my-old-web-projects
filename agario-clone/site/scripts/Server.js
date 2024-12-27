import { Menu, GameMap, GameControl, PlayersManager } from './@imports.js';
import { RPC_Modes, ClientDataSchemas } from './client_server/index.js';
export class Server {
    constructor(socket) {
        this.updatePosDelay = 100;
        this.lastUpdatePosTime = new Date().getTime();
        this.lastPingTime = new Date().getTime();
        this.pingInfo = { toServer: -1, back: -1 };
        this.socket = socket;
        this.gameControl = GameControl.Instance;
        this.gameMap = GameMap.Instance;
        this.menu = Menu.Instance;
        this.InitializeEventHandler();
        console.log("Server initialized.");
    }
    static get Instance() {
        return this.instance;
    }
    static Initialize(socket) {
        if (this.instance) {
            throw new Error("Server already initialized!");
        }
        this.instance = new this(socket);
    }
    get ConnectionState() {
        return this.socket.connected;
    }
    get Ping() {
        return `Ping: &#11014; ${this.pingInfo.toServer} | &#11015; ${this.pingInfo.back}`;
    }
    InitializeEventHandler() {
        this.socket.on('connect', () => this.UpdateConnectionState());
        this.socket.io.on('reconnect_error', () => this.UpdateConnectionState());
        this.socket.on('disconnect', (reason) => this.UpdateConnectionState(reason));
        this.socket.on(RPC_Modes.ToClient.Pong, (data) => this.UpdatePingInfo(data));
        this.socket.on(RPC_Modes.ToClient.MapInit, (res) => this.gameControl.OnMapInit(res));
        this.socket.on(RPC_Modes.ToClient.UpdateOnline, (data) => this.menu.UpdateOnline(data));
        this.socket.on(RPC_Modes.ToClient.NewPlayer, (newPlayer) => this.gameControl.OnNewPlayer(newPlayer));
        this.socket.on(RPC_Modes.ToClient.PlayerDisconnected, (data) => this.gameControl.OnPlayerDisconnected(data));
        this.socket.on(RPC_Modes.ToClient.UpdateEnemyPos, (data) => this.gameControl.OnUpdateEnemyPos(data));
        this.socket.on(RPC_Modes.ToClient.SomeoneAteFood, (data) => this.gameControl.OnPlayerAteFood(data));
        this.socket.on(RPC_Modes.ToClient.SomeoneAteThorn, (data) => this.gameControl.OnPlayerAteThorn(data));
        this.socket.on(RPC_Modes.ToClient.SomeoneAteEnemy, (data) => this.gameControl.OnPlayerAteEnemy(data));
        this.socket.on(RPC_Modes.ToClient.GenerateNewFoods, (data) => this.gameMap.AddNewFoodPoints(data));
        this.socket.on(RPC_Modes.ToClient.GenerateNewThorns, (data) => this.gameMap.AddNewThorns(data));
        this.socket.on(RPC_Modes.ToClient.CreatedPlayerFood, (data) => this.gameControl.OnCreatedPlayerFood(data));
    }
    UpdateConnectionState(reason) {
        if (reason === 'io server disconnect')
            reason = "You were kicked from the server.";
        else if (reason === "transport close")
            reason = "Server connection has been lost.";
        else
            reason = "The server is down.";
        if (this.ConnectionState) {
            console.log("Server connection established.");
            this.menu.OnServerConnected();
            this.StartPing();
            return;
        }
        console.error((!reason) ? "Disconnected." : reason);
        this.menu.OnServerDisconnected();
        this.gameControl.Clear();
        PlayersManager.Instance.ClearLocalPlayerServerID();
        this.StopPing();
    }
    StartPing() {
        this.StopPing();
        this.pingInterval = setInterval(() => {
            this.lastPingTime = new Date().getTime();
            this.RPC_Ping();
        }, 3000);
    }
    UpdatePingInfo(data) {
        this.pingInfo.toServer = data.time - this.lastPingTime;
        this.pingInfo.back = new Date().getTime() - this.lastPingTime;
    }
    StopPing() {
        clearInterval(this.pingInterval);
        this.pingInfo.toServer = "-";
        this.pingInfo.back = "-";
    }
    RPC(command, data) {
        if (!this.ConnectionState) {
            return console.error("[RPC] Connection error.");
        }
        this.socket.emit(command, data);
    }
    RPC_ReadyToSpawn(playerName) {
        this.RPC(RPC_Modes.ToServer.ReadyToSpawn, new ClientDataSchemas.Spawn(playerName));
    }
    RPC_UpdatePOS(data) {
        let currentTime = new Date().getTime();
        if ((currentTime - this.lastUpdatePosTime) > this.updatePosDelay) {
            this.lastUpdatePosTime = currentTime;
            this.RPC(RPC_Modes.ToServer.UpdatePos, data);
        }
    }
    RPC_AteFood(removedFoods) {
        this.RPC(RPC_Modes.ToServer.AteFood, new ClientDataSchemas.AteFood(removedFoods));
    }
    RPC_AteThorn(removedThorns) {
        this.RPC(RPC_Modes.ToServer.AteThorn, new ClientDataSchemas.AteThorn(removedThorns));
    }
    RPC_AteEnemy(enemyId) {
        this.RPC(RPC_Modes.ToServer.AteEnemy, new ClientDataSchemas.AteEnemy(enemyId));
    }
    RPC_Ping() {
        this.RPC(RPC_Modes.ToServer.Ping, new ClientDataSchemas.Empty());
    }
    RPC_CreatePlayerFood(mousePoisition) {
        this.RPC(RPC_Modes.ToServer.CreatePlayerFood, new ClientDataSchemas.CreatePlayerFoods(mousePoisition));
    }
}
Server.instance = null;
