import { timeStamp } from 'console';
import { Game, System, Camera, VectorPoint, GetMousePosition, MouseControl, KeyControl, GetPercentage, Menu, AudioManager, Server, GameMap, Player, LocalPlayer, Debugger, Leaderboard, PlayersManager } from './@imports.js';
import { ClientDataSchemas, ServerDataSchemas } from './client_server/index.js';

export class GameControl
{
    private static instance: GameControl = null;

    private menu: Menu;
    private audioManager: AudioManager;
    private server: Server;
    private playersManager: PlayersManager;
    private gameMap: GameMap;
    private debugger: Debugger;
    private leaderboard: Leaderboard;

    private cameraZoomValue: number = 0;
    private minPlayerRadius: number;
    private maxPlayerRadius: number;
    private minPlayerScore: number = 10;
    private minPlayerRadiusForEdiblePlayerPart: number;

    private constructor()
    {
    }

    public static get Instance(): GameControl
    {
        return this.instance;
    }

    public static Initialize(socketFromServer?: any): void
    {
        if (this.instance)
        {
            throw new Error("GameControl already initialized!");
        }

        this.instance = new this();

        Server.Initialize(socketFromServer);
        this.instance.server         = Server.Instance;
        this.instance.playersManager = PlayersManager.Instance;
        this.instance.audioManager   = AudioManager.Instance;
        this.instance.menu           = Menu.Instance;
        this.instance.gameMap        = GameMap.Instance;
        this.instance.debugger       = Debugger.Instance;
        this.instance.leaderboard    = Leaderboard.Instance;

        console.log("GameControl initialized.");
    }

    public Start(): void
    {
        /* Запустить игровой цикл через движок PointJS */
        Game.newLoop("game", () => this.ProcessFrame());
    }

    private ProcessFrame(): void
    {
        /* Не обновлять игровую сцену, если отсутствует подключение к серверу */
        if (!this.server.ConnectionState)
        {
            return;
        }

        this.CheckPressedKey();
        this.gameMap.DrawTiles();
        this.gameMap.ClearGameObjectsForRendering();
        this.CheckFoodPointIntersect();
        this.CheckThornsIntersect();
        this.UpdateEnemies();
        this.UpdateLocalPlayer();
        this.gameMap.RenderGameObjects();
    }

    public OnUpdatePlayerData(data: ServerDataSchemas.UpdatePlayer): void
    {
        let player = this.playersManager.GetPlayer(data.id);

        if (!player)
        {
            return;
        }

        player.UpdateData(data.radius, data.score);
        this.leaderboard.UpdatePlayer(player.ToLedearboard());

        if (this.playersManager.IsLocalPlayer(data.id))
        {
            this.menu.UpdateScore((player as LocalPlayer).GetMaxScore());
        }
    }

    public OnPlayerDisconnected(data: ServerDataSchemas.PlayerDisconnected): void
    {
        this.leaderboard.RemovePlayer(data.id);
        this.playersManager.RemovePlayer(data.id);
        this.menu.UpdateOnline(data.onlineInfo);
    }

    private AddAllEnemies(enemies: Array<[string, ServerDataSchemas.PlayerToRender]>): void
    {
        new Map(enemies).forEach((enemy) =>
        {
            this.AddEnemy(enemy);
        });
    }

    private AddEnemy(newPlayer: ServerDataSchemas.PlayerToRender): void
    {
        this.leaderboard.AddNewPlayer(this.playersManager.CreateEnemyPlayer(newPlayer).ToLedearboard());
    }

    public Clear(): void
    {
        this.leaderboard.Clear();
        this.playersManager.Clear();
    }

    public OnMapInit(data: ServerDataSchemas.MapInitialization): void
    {
        this.Clear();

        this.playersManager.SetLocalPlayerId(data.local_id);
        this.minPlayerRadius = data.server_settings.min_player_radius;
        Player.MaxRadius = data.server_settings.max_player_radius;
        Player.MinRadiusToCreateFood = data.server_settings.min_player_radius_for_ediblePlayerPart;

        // Запуск игрового цикла
        Game.setLoop("game");
        Game.start();

        // Активация служб движка PointJS
        System.initFPSCheck();
        System.initFullPage();

        this.gameMap.CreateMap(data.map);

        let mapDividedSize: number = this.gameMap.MapSize / 2;
        Camera.setPositionC(VectorPoint(mapDividedSize, mapDividedSize));

        this.AddAllEnemies(data.enemies);
        this.leaderboard.Initialize(this.playersManager.EnemiesToLedearBoard);
        this.menu.Show(false);
    }

    private SpawnLocalPlayer(params: ServerDataSchemas.PlayerToRender): void
    {
        this.playersManager.CreateLocalPlayer(params);
        this.leaderboard.AddLocalPlayer(this.playersManager.LocalPlayer.ToLedearboard());

        this.SetCameraPosOverLocalPlayer();

        this.menu.UpdateScore(this.playersManager.LocalPlayer.GetMaxScore());
        this.menu.Hide();
    }

    public OnNewPlayer(newPlayer: ServerDataSchemas.PlayerToRender): void
    {
        if (this.playersManager.IsLocalPlayer(newPlayer.id))
        {
            this.SpawnLocalPlayer(newPlayer);
            return;
        }

        this.AddEnemy(newPlayer);
    }

    public OnUpdateEnemyPos(player: ServerDataSchemas.UpdatePlayerPos): void
    {
        this.playersManager.GetPlayer(player.id)?.SetPos(player);
    }

    public OnPlayerAteFood(data: ServerDataSchemas.AteFood): void
    {
        this.gameMap.RemoveFoodPoints(data.removedFoods);
        this.OnUpdatePlayerData(data.player);
    }

    public OnPlayerAteThorn(data: ServerDataSchemas.AteThorn): void
    {
        this.gameMap.RemoveThorns(data.removedThorns);
        this.OnUpdatePlayerData(data.player);
    }

    public OnPlayerAteEnemy(data: ServerDataSchemas.AteEnemy): void
    {
        this.OnUpdatePlayerData(data.killer);
        this.ProcessOfKillingPlayer(data.killer.id, data.enemyId);
    }

    public OnCreatedPlayerFood(data: ServerDataSchemas.NewPlayerFood): void
    {
        this.gameMap.AddNewFoodPoints(data.newFoods);
        this.OnUpdatePlayerData(data.ownerData);
    }

    private CheckPressedKey(): void
    {
        this.UpdateZoom();
        this.OnWPressed();
    }

    private UpdateZoom(): void
    {
        if (MouseControl.isWheel("UP") && this.cameraZoomValue < 4)
        {
            this.cameraZoomValue += 1;
            Camera.scaleC(VectorPoint(1.2, 1.2)); 
            return;
        }
        
        if (MouseControl.isWheel("DOWN") && this.cameraZoomValue > -4) 
        {
            this.cameraZoomValue -= 1;
            Camera.scaleC(VectorPoint(0.8334, 0.8334)); 
        }
    }

    private OnWPressed(): void
    {
        if (KeyControl.isPress("W") || KeyControl.isPress("SPACE"))
        {
            this.LocalPlayer_CreatedPlayerFoods();
        }
    }

    private LocalPlayer_AteFood(removedFoods: string[]): void
    {
        if (this.playersManager.LocalPlayer.IsRadiusPeaked())
        {   
            return;
        }

        this.server.RPC_AteFood(removedFoods);
    }

    private LocalPlayer_AteThorn(removedThorns: string[]): void
    {
        this.server.RPC_AteThorn(removedThorns);
        this.audioManager.AteThorn();
    }

    private LocalPlayer_AteEnemy(enemy: Player): void
    {
        this.server.RPC_AteEnemy(enemy.GetServerId());
    }

    private LocalPlayer_CreatedPlayerFoods(): void
    {
        if (!this.playersManager.LocalPlayer.CanCreateFood())
        {   
            return;
        }

        this.server.RPC_CreatePlayerFood(GetMousePosition());
    }

    private CheckFoodPointIntersect(): void
    {
        let removedFoods: string[] = this.gameMap.CheckFoodPointsIntersect(this.playersManager.LocalPlayerIsAlive, this.playersManager.LocalPlayer);

        if (removedFoods.length > 0)
        {
            this.LocalPlayer_AteFood(removedFoods);
        }
    }

    private CheckThornsIntersect(): void
    {
        let removedThorns: string[] = this.gameMap.CheckThornsIntersect(this.playersManager.LocalPlayerIsAlive, this.playersManager.LocalPlayer);

        if (removedThorns.length > 0)
        {
            this.LocalPlayer_AteThorn(removedThorns);
        }
    }

    private ProcessOfKillingPlayer(killerId, enemyId): void
    {
        let killer = this.playersManager.GetPlayer(killerId);
        let enemy  = this.playersManager.GetPlayer(enemyId);

        if (!killer || !enemy)
        {
            return;
        }

        if (killer.isInCamera() && enemy.isInCamera())
        {
            let enemyIsLocalPlayer = this.playersManager.IsLocalPlayer(enemyId);

            // Двигать врага к центру локлаьного игрока (типо анимация)
            enemy.moveToC(killer.getPositionC(), 7, 7);

            if (enemy.IsAlive())
            {
                enemy.Die();
                enemy.SetKiller(killer.GetServerId());
                this.audioManager.Die();
                
                if (enemyIsLocalPlayer)
                {
                    this.menu.Show();
                }
            }

            // Убийца скушал жертву
            if (killer.getDistanceC(enemy.getPositionC()) <= 10)
            {
                if (enemyIsLocalPlayer)
                {
                    this.playersManager.RemovePlayer(this.playersManager.LocalPlayer.GetServerId());
                    return;
                }

                this.playersManager.RemovePlayer(enemy.GetServerId());
            }

            return;
        }

        // Если игрок вне поля зрения камеры
        // сразу удалить вражеского игрока
        this.playersManager.RemovePlayer(enemy.GetServerId());
    }

    private UpdateLocalPlayer(): void
    {
        if (!this.playersManager.LocalPlayerIsAlive)
        {
            return;
        }

        let localPlayer = this.playersManager.LocalPlayer;

        if (localPlayer.GetKiller())
        {
            this.ProcessOfKillingPlayer(localPlayer.GetKiller(), localPlayer.GetServerId());
            this.gameMap.AddGameObjectToRender(localPlayer);
            return;
        }

        localPlayer.ProcessUpdateRadius();
        localPlayer.UpdatePointToMove(GetMousePosition());
        localPlayer.UpdateSpeed();
        localPlayer.UpdateNickname();

        // Если игрок в пределах карты
        if (this.gameMap.CheckMapMapBorder(localPlayer.getPositionC(), localPlayer.GetPos())) 
        {
            this.server.RPC_UpdatePOS
            (
                new ClientDataSchemas.UpdatePos
                (
                    localPlayer.x,
                    localPlayer.y,
                    localPlayer.GetPos()
                )
            );

            localPlayer.Move();
            Camera.follow(localPlayer, localPlayer.GetSpeed() + 1);
        }

        this.gameMap.AddGameObjectToRender(localPlayer);
    }

    private CheckEnemyIntersect(enemy): boolean
    {
        if ((this.playersManager.LocalPlayer.radius > enemy.radius + 3) 
            && this.playersManager.LocalPlayer.isStaticIntersect(enemy)
            && this.playersManager.LocalPlayer.getDistanceC(enemy.getPositionC()) <= this.playersManager.LocalPlayer.radius)
        {
            if (enemy.alive)
            {
                this.LocalPlayer_AteEnemy(enemy);
            }
            
            this.ProcessOfKillingPlayer(this.playersManager.LocalPlayer.GetServerId(), enemy.GetServerId());
            
            return true;
        }

        return false;
    }

    private UpdateEnemies(): void
    {
        for (let enemy of this.playersManager.EnemiesIterator)
        {
            enemy.TryFixPosition();

            if (enemy.isInCamera()) 
            {
                if (enemy.GetKiller())
                {
                    this.ProcessOfKillingPlayer(enemy.GetKiller(), enemy.GetServerId());

                    this.gameMap.AddGameObjectToRender(enemy);
                    continue;
                }

                // Проверитить, может ли локальный игрок скушать врага
                if (this.playersManager.LocalPlayerIsAlive && this.CheckEnemyIntersect(enemy))
                {
                    this.gameMap.AddGameObjectToRender(enemy);
                    continue;
                }

                enemy.ProcessUpdateRadius();
                enemy.UpdateNickname();

                // Обновить позицию вражеского игрока
                // если дистанция до новой точки больше дозволенного
                if (enemy.CheckDistanceToPos()) 
                {
                    enemy.UpdateSpeed();

                    // Если игрок в пределах карты
                    if (this.gameMap.CheckMapMapBorder(enemy.getPositionC(), enemy.GetPos())) 
                    {
                        enemy.Move();
                    }
                } 

                this.gameMap.AddGameObjectToRender(enemy);
                continue;
            }

            // Если игрок вне поля зрения камеры
            // не двигать объект, а сразу переместить по нужным координатам
            enemy.TeleportToDefaultPos();
        }
    }

    private SetCameraPosOverLocalPlayer()
    {
        Camera.setPositionC(this.playersManager.LocalPlayer.getPositionC());
    }
}