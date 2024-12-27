import { Menu, GameMap, GameControl, PlayersManager } from './@imports.js';
import { RPC_Modes, ClientDataSchemas, ServerDataSchemas, DataTypes } from './client_server/index.js';

export class Server
{
    private static instance: Server = null;

    private gameControl: GameControl;
    private gameMap: GameMap;
    private menu: Menu;

    private socket: any;
    private updatePosDelay: number = 100;
    private lastUpdatePosTime = new Date().getTime();
    private lastPingTime = new Date().getTime();
    private pingInfo: { toServer: number | string, back: number | string } = { toServer: -1, back: -1 };
    private pingInterval: any;

    private constructor(socket?: any)
    {
        this.socket = socket;
        this.gameControl = GameControl.Instance;
        this.gameMap = GameMap.Instance;
        this.menu = Menu.Instance;
        this.InitializeEventHandler();

        console.log("Server initialized.");
    }

    public static get Instance(): Server
    {
        return this.instance;
    }

    public static Initialize(socket?: any): void
    {
        if (this.instance)
        {
            throw new Error("Server already initialized!");
        }

        this.instance = new this(socket);
    }

    public get ConnectionState(): boolean
    {
        return this.socket.connected;
    }

    public get Ping(): string
    {
        return `Ping: &#11014; ${this.pingInfo.toServer} | &#11015; ${this.pingInfo.back}`;
    }

    private InitializeEventHandler(): void
    {
        this.socket.on('connect', () => this.UpdateConnectionState());
    
        this.socket.io.on('reconnect_error', () => this.UpdateConnectionState());
    
        this.socket.on('disconnect', (reason: string) => this.UpdateConnectionState(reason));

        this.socket.on(RPC_Modes.ToClient.Pong, (data: ServerDataSchemas.Ping) => this.UpdatePingInfo(data));

        this.socket.on(RPC_Modes.ToClient.MapInit, (res: ServerDataSchemas.MapInitialization) => this.gameControl.OnMapInit(res));

        this.socket.on(RPC_Modes.ToClient.UpdateOnline, (data: ServerDataSchemas.UpdateOnline) => this.menu.UpdateOnline(data));

        this.socket.on(RPC_Modes.ToClient.NewPlayer, (newPlayer: ServerDataSchemas.PlayerToRender) => this.gameControl.OnNewPlayer(newPlayer));

        this.socket.on(RPC_Modes.ToClient.PlayerDisconnected, (data: ServerDataSchemas.PlayerDisconnected) => this.gameControl.OnPlayerDisconnected(data));

        this.socket.on(RPC_Modes.ToClient.UpdateEnemyPos, (data: ServerDataSchemas.UpdatePlayerPos) => this.gameControl.OnUpdateEnemyPos(data));

        this.socket.on(RPC_Modes.ToClient.SomeoneAteFood, (data: ServerDataSchemas.AteFood) => this.gameControl.OnPlayerAteFood(data));

        this.socket.on(RPC_Modes.ToClient.SomeoneAteThorn, (data: ServerDataSchemas.AteThorn) => this.gameControl.OnPlayerAteThorn(data));

        this.socket.on(RPC_Modes.ToClient.SomeoneAteEnemy, (data: ServerDataSchemas.AteEnemy) => this.gameControl.OnPlayerAteEnemy(data));

        this.socket.on(RPC_Modes.ToClient.GenerateNewFoods, (data: ServerDataSchemas.NewFoods) => this.gameMap.AddNewFoodPoints(data));

        this.socket.on(RPC_Modes.ToClient.GenerateNewThorns, (data: ServerDataSchemas.NewThorns) => this.gameMap.AddNewThorns(data));
        
        this.socket.on(RPC_Modes.ToClient.CreatedPlayerFood, (data: ServerDataSchemas.NewPlayerFood) => this.gameControl.OnCreatedPlayerFood(data));
    }

    private UpdateConnectionState(reason?: string): void
    {
        if (reason === 'io server disconnect')
            reason = "You were kicked from the server.";
        else if (reason === "transport close")
            reason = "Server connection has been lost.";
        else
            reason = "The server is down.";

        if (this.ConnectionState)
        {
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

    private StartPing(): void
    {
        this.StopPing();

        this.pingInterval = setInterval(
            () =>
            {
                this.lastPingTime = new Date().getTime();
                this.RPC_Ping();
            }, 3000
        );
    }

    public UpdatePingInfo(data: ServerDataSchemas.Ping): void
    {
        this.pingInfo.toServer = data.time - this.lastPingTime;
        this.pingInfo.back = new Date().getTime() - this.lastPingTime;
    }

    private StopPing(): void
    {
        clearInterval(this.pingInterval);
        this.pingInfo.toServer = "-";
        this.pingInfo.back = "-";
    }

    private RPC(command: string, data: {}): void
    {
        if (!this.ConnectionState)
        {
            return console.error("[RPC] Connection error.");
        }

        this.socket.emit(command, data);
    }

    public RPC_ReadyToSpawn(playerName: string): void
    {
        this.RPC(RPC_Modes.ToServer.ReadyToSpawn, new ClientDataSchemas.Spawn(playerName));
    }

    public RPC_UpdatePOS(data: ClientDataSchemas.UpdatePos): void
    {
        let currentTime = new Date().getTime();

        if ((currentTime - this.lastUpdatePosTime) > this.updatePosDelay)
        {
            this.lastUpdatePosTime = currentTime;
            this.RPC(RPC_Modes.ToServer.UpdatePos, data);
        } 
    }

    public RPC_AteFood(removedFoods: string[]): void
    {
        this.RPC(RPC_Modes.ToServer.AteFood, new ClientDataSchemas.AteFood(removedFoods));
    }

    public RPC_AteThorn(removedThorns: string[]): void
    {
        this.RPC(RPC_Modes.ToServer.AteThorn, new ClientDataSchemas.AteThorn(removedThorns));
    }

    public RPC_AteEnemy(enemyId: string): void
    {
        this.RPC(RPC_Modes.ToServer.AteEnemy, new ClientDataSchemas.AteEnemy(enemyId));
    }

    public RPC_Ping(): void
    {
        this.RPC(RPC_Modes.ToServer.Ping, new ClientDataSchemas.Empty());
    }

    public RPC_CreatePlayerFood(mousePoisition: DataTypes.Vector2): void
    {
        this.RPC(RPC_Modes.ToServer.CreatePlayerFood, new ClientDataSchemas.CreatePlayerFoods(mousePoisition));
    }
}