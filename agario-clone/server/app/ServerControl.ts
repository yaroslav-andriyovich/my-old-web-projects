import { Config, Player, PlayersManager, FoodManager, ThornManager, Utils } from 'server';
import { RPC_Modes, DataTypes, ClientDataSchemas, ServerDataSchemas } from 'client_server';

export class ServerControl
{
    private static instance: ServerControl = null;
    private playersManager: PlayersManager;
    private foodManager: FoodManager;
    private thornManager: ThornManager;
    private socketIo: any;

    public constructor(socketIo: any)
    {
        if (ServerControl.instance)
        {
            return ServerControl.instance;
        }

        ServerControl.instance = this;
        
        this.playersManager = PlayersManager.Instance;
        this.foodManager = new FoodManager();
        this.thornManager = new ThornManager();
        this.socketIo = socketIo;
    }

    private OnNewClientEvent(socket: any, data: any, dataType: any, methodToRun: Function): void
    {
        if (!DataTypes.DataValidation(dataType.ForValidation, data))
        {
            console.debug("DataValidationError! Player kicked: ", this.playersManager.GetPlayer(socket.client.id));
            this.OnPlayerDisconnected(socket);
            return;
        }

        methodToRun();
    }

    private InitializeEventHandler(socket: any): void
    {
        let player = this.InitializePlayer(socket);
        
        socket.on(RPC_Modes.ToServer.Ping, (data: any) => this.OnNewClientEvent(socket, data, ClientDataSchemas.Empty, () => this.OnPing(socket)));

        socket.on(RPC_Modes.ToServer.ReadyToSpawn, (data: any) => this.OnNewClientEvent(socket, data, ClientDataSchemas.Spawn, () => this.SpawnNewPlayer(player, data.nickname)));

        socket.on(RPC_Modes.ToServer.UpdatePos, (data: any) => this.OnNewClientEvent(socket, data, ClientDataSchemas.UpdatePos, () => this.UpdatePlayerPosition(socket, player, data)));

        socket.on(RPC_Modes.ToServer.AteFood, (data: any) => this.OnNewClientEvent(socket, data, ClientDataSchemas.AteFood, () => this.OnPlayerAteFood(socket, player, data)));

        socket.on(RPC_Modes.ToServer.AteThorn, (data: any) => this.OnNewClientEvent(socket, data, ClientDataSchemas.AteThorn, () => this.OnPlayerAteThorn(socket, player, data)));

        socket.on(RPC_Modes.ToServer.AteEnemy, (data: any) => this.OnNewClientEvent(socket, data, ClientDataSchemas.AteEnemy, () => this.OnPlayerAteEnemy(player, data)));
        
        socket.on(RPC_Modes.ToServer.CreatePlayerFood, (data: any) => this.OnNewClientEvent(socket, data, ClientDataSchemas.CreatePlayerFoods, () => this.OnCreatePlayerFoods(player, data)));

        socket.on("disconnect", () => this.OnPlayerDisconnected(socket));
    }

    public Initialize(): void
    {
        this.socketIo.on("connection", (socket: any) => this.InitializeEventHandler(socket));
    }

    private get Online(): number
    {
        let room = this.socketIo.sockets.adapter.rooms.get(Config.room_name);
        return (!room) ? 0 : room.size;
    }

    private RPC(socket: any, mode: string, command: string, data: any): void
    {
        switch(mode)
        {
            case RPC_Modes.Mode.ToLocal:
                socket.emit(command, data);
                return;
            case RPC_Modes.Mode.ToAll:
                this.socketIo.in(Config.room_name).emit(command, data);
                return;
            case RPC_Modes.Mode.ToAllExceptLocal:
                socket.to(Config.room_name).emit(command, data);
                return;
            default:
                console.error("Unknown RPC mode: " + mode);
                return;
        }
    }

    private UpdateOnline(): void
    {
        this.RPC(null, RPC_Modes.Mode.ToAll, RPC_Modes.ToClient.UpdateOnline, new ServerDataSchemas.UpdateOnline(this.Online));
    }

    private InitializePlayer(socket: any): Player
    {   
        let socketId = socket.client.id;

        if (this.playersManager.GetPlayer(socketId))
        {
            return;
        }

        socket.join(Config.room_name);

        let newPlayer = this.playersManager.AddPlayer(socketId);

        this.RPC(socket, RPC_Modes.Mode.ToLocal, RPC_Modes.ToClient.MapInit, 
            new ServerDataSchemas.MapInitialization
            (
                Config.map_size,
                Config.min_edge_distance,
                Config.tile_size,
                Config.tile_count,
                this.foodManager.ListToSend,
                this.thornManager.ListToSend,
                this.playersManager.GetAllExceptLocal(newPlayer.Id),
                newPlayer.Id,
                Config.player_scale_value,
                Config.min_player_radius,
                Config.max_player_radius,
                Config.min_player_radius_for_ediblePlayerPart
            )
        );
        this.UpdateOnline();

        return newPlayer;
    }

    private SpawnNewPlayer(player: Player, nickname: string): void
    {
        this.RPC(null, RPC_Modes.Mode.ToAll, RPC_Modes.ToClient.NewPlayer, player.Spawn(nickname));
    }

    private OnPlayerDisconnected(socket: any): void
    {
        this.playersManager.RemovePlayer(socket.client.id);

        this.RPC(null, RPC_Modes.Mode.ToAll, RPC_Modes.ToClient.PlayerDisconnected, 
            new ServerDataSchemas.PlayerDisconnected
            (
                socket.client.id, 
                new ServerDataSchemas.UpdateOnline(this.Online)
            )
        );

        socket.disconnect();
    }

    private OnPlayerAteFood(socket, player: Player, data: ClientDataSchemas.AteFood): void
    {
        if (player.IsRadiusPeaked)
        {
            return;
        }

        let removedFoods: string[] = Object.values(data.removedFoods);
        let removedCount = this.foodManager.Remove(removedFoods);

        if (!removedCount)    
        {
            return;
        }

        player.AteFood(removedCount);

        this.RPC(socket, RPC_Modes.Mode.ToAll, RPC_Modes.ToClient.SomeoneAteFood, new ServerDataSchemas.AteFood(removedFoods, new ServerDataSchemas.UpdatePlayer(player.Id, player.Radius, player.Score)));
        this.AddNewFoodPoints();
    }

    private OnPlayerAteThorn(socket, player: Player, data: ClientDataSchemas.AteThorn): void
    {
        let removedThorns: string[] = Object.values(data.removedThorns);
        let removedCount = this.thornManager.Remove(removedThorns);

        if (!removedCount)    
        {
            return;
        }

        player.AteThorn();

        this.RPC(socket, RPC_Modes.Mode.ToAll, RPC_Modes.ToClient.SomeoneAteThorn, new ServerDataSchemas.AteThorn(removedThorns, new ServerDataSchemas.UpdatePlayer(player.Id, player.Radius, player.Score)));
        this.AddNewThorns();
    }

    private OnPlayerAteEnemy(player: Player, data: ClientDataSchemas.AteEnemy): void
    {
        let enemy = this.playersManager.GetPlayer(data.enemyId);

        if (!enemy)
        {
            return;
        }

        player.AteEnemy(enemy.Radius, enemy.Score);
        enemy.Die();

        this.RPC(null, RPC_Modes.Mode.ToAll, RPC_Modes.ToClient.SomeoneAteEnemy, new ServerDataSchemas.AteEnemy(enemy.Id, new ServerDataSchemas.UpdatePlayer(player.Id, player.Radius, player.Score)));
    }

    private UpdatePlayerPosition(socket: any, player: Player, updatePosData: ClientDataSchemas.UpdatePos): void
    {
        if (!player.Alive)
        {
            return;
        }

        this.RPC(socket, RPC_Modes.Mode.ToAllExceptLocal, RPC_Modes.ToClient.UpdateEnemyPos, player.UpdatePosition(updatePosData));
    }

    private OnPing(socket: any): void
    {
        this.RPC(socket, RPC_Modes.Mode.ToLocal, RPC_Modes.ToClient.Pong, new ServerDataSchemas.Ping());
    }

    private AddNewFoodPoints(): void
    {
        if (!this.foodManager.CanGenerateFood)
        {
            return;
        }

        this.RPC(null, RPC_Modes.Mode.ToAll, RPC_Modes.ToClient.GenerateNewFoods, new ServerDataSchemas.NewFoods(this.foodManager.GenerateNewFood()));
    }

    private OnCreatePlayerFoods(player: Player, data: ClientDataSchemas.CreatePlayerFoods): void
    {
        if (player.Radius < Config.min_player_radius_for_ediblePlayerPart)
        {
            return;
        }

        player.CreatedOwnFood();

        this.RPC(null, RPC_Modes.Mode.ToAll, RPC_Modes.ToClient.CreatedPlayerFood, new ServerDataSchemas.NewPlayerFood(new ServerDataSchemas.NewFoods(this.foodManager.GeneratePlayerFood(player, new DataTypes.Vector2(data.mousePosition.x, data.mousePosition.y))), new ServerDataSchemas.UpdatePlayer(player.Id, player.Radius, player.Score)));
    }

    private AddNewThorns(): void
    {
        if (this.thornManager.Count >= Config.max_thorns_count)
        {
            return;
        }

        this.RPC(null, RPC_Modes.Mode.ToAll, RPC_Modes.ToClient.GenerateNewThorns, new ServerDataSchemas.NewThorns(this.thornManager.Generate()));
    }
}