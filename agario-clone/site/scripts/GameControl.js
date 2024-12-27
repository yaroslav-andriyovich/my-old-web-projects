import { Game, System, Camera, VectorPoint, GetMousePosition, MouseControl, KeyControl, Menu, AudioManager, Server, GameMap, Player, Debugger, Leaderboard, PlayersManager } from './@imports.js';
import { ClientDataSchemas } from './client_server/index.js';
export class GameControl {
    constructor() {
        this.cameraZoomValue = 0;
        this.minPlayerScore = 10;
    }
    static get Instance() {
        return this.instance;
    }
    static Initialize(socketFromServer) {
        if (this.instance) {
            throw new Error("GameControl already initialized!");
        }
        this.instance = new this();
        Server.Initialize(socketFromServer);
        this.instance.server = Server.Instance;
        this.instance.playersManager = PlayersManager.Instance;
        this.instance.audioManager = AudioManager.Instance;
        this.instance.menu = Menu.Instance;
        this.instance.gameMap = GameMap.Instance;
        this.instance.debugger = Debugger.Instance;
        this.instance.leaderboard = Leaderboard.Instance;
        console.log("GameControl initialized.");
    }
    Start() {
        Game.newLoop("game", () => this.ProcessFrame());
    }
    ProcessFrame() {
        if (!this.server.ConnectionState) {
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
    OnUpdatePlayerData(data) {
        let player = this.playersManager.GetPlayer(data.id);
        if (!player) {
            return;
        }
        player.UpdateData(data.radius, data.score);
        this.leaderboard.UpdatePlayer(player.ToLedearboard());
        if (this.playersManager.IsLocalPlayer(data.id)) {
            this.menu.UpdateScore(player.GetMaxScore());
        }
    }
    OnPlayerDisconnected(data) {
        this.leaderboard.RemovePlayer(data.id);
        this.playersManager.RemovePlayer(data.id);
        this.menu.UpdateOnline(data.onlineInfo);
    }
    AddAllEnemies(enemies) {
        new Map(enemies).forEach((enemy) => {
            this.AddEnemy(enemy);
        });
    }
    AddEnemy(newPlayer) {
        this.leaderboard.AddNewPlayer(this.playersManager.CreateEnemyPlayer(newPlayer).ToLedearboard());
    }
    Clear() {
        this.leaderboard.Clear();
        this.playersManager.Clear();
    }
    OnMapInit(data) {
        this.Clear();
        this.playersManager.SetLocalPlayerId(data.local_id);
        this.minPlayerRadius = data.server_settings.min_player_radius;
        Player.MaxRadius = data.server_settings.max_player_radius;
        Player.MinRadiusToCreateFood = data.server_settings.min_player_radius_for_ediblePlayerPart;
        Game.setLoop("game");
        Game.start();
        System.initFPSCheck();
        System.initFullPage();
        this.gameMap.CreateMap(data.map);
        let mapDividedSize = this.gameMap.MapSize / 2;
        Camera.setPositionC(VectorPoint(mapDividedSize, mapDividedSize));
        this.AddAllEnemies(data.enemies);
        this.leaderboard.Initialize(this.playersManager.EnemiesToLedearBoard);
        this.menu.Show(false);
    }
    SpawnLocalPlayer(params) {
        this.playersManager.CreateLocalPlayer(params);
        this.leaderboard.AddLocalPlayer(this.playersManager.LocalPlayer.ToLedearboard());
        this.SetCameraPosOverLocalPlayer();
        this.menu.UpdateScore(this.playersManager.LocalPlayer.GetMaxScore());
        this.menu.Hide();
    }
    OnNewPlayer(newPlayer) {
        if (this.playersManager.IsLocalPlayer(newPlayer.id)) {
            this.SpawnLocalPlayer(newPlayer);
            return;
        }
        this.AddEnemy(newPlayer);
    }
    OnUpdateEnemyPos(player) {
        var _a;
        (_a = this.playersManager.GetPlayer(player.id)) === null || _a === void 0 ? void 0 : _a.SetPos(player);
    }
    OnPlayerAteFood(data) {
        this.gameMap.RemoveFoodPoints(data.removedFoods);
        this.OnUpdatePlayerData(data.player);
    }
    OnPlayerAteThorn(data) {
        this.gameMap.RemoveThorns(data.removedThorns);
        this.OnUpdatePlayerData(data.player);
    }
    OnPlayerAteEnemy(data) {
        this.OnUpdatePlayerData(data.killer);
        this.ProcessOfKillingPlayer(data.killer.id, data.enemyId);
    }
    OnCreatedPlayerFood(data) {
        this.gameMap.AddNewFoodPoints(data.newFoods);
        this.OnUpdatePlayerData(data.ownerData);
    }
    CheckPressedKey() {
        this.UpdateZoom();
        this.OnWPressed();
    }
    UpdateZoom() {
        if (MouseControl.isWheel("UP") && this.cameraZoomValue < 4) {
            this.cameraZoomValue += 1;
            Camera.scaleC(VectorPoint(1.2, 1.2));
            return;
        }
        if (MouseControl.isWheel("DOWN") && this.cameraZoomValue > -4) {
            this.cameraZoomValue -= 1;
            Camera.scaleC(VectorPoint(0.8334, 0.8334));
        }
    }
    OnWPressed() {
        if (KeyControl.isPress("W") || KeyControl.isPress("SPACE")) {
            this.LocalPlayer_CreatedPlayerFoods();
        }
    }
    LocalPlayer_AteFood(removedFoods) {
        if (this.playersManager.LocalPlayer.IsRadiusPeaked()) {
            return;
        }
        this.server.RPC_AteFood(removedFoods);
    }
    LocalPlayer_AteThorn(removedThorns) {
        this.server.RPC_AteThorn(removedThorns);
        this.audioManager.AteThorn();
    }
    LocalPlayer_AteEnemy(enemy) {
        this.server.RPC_AteEnemy(enemy.GetServerId());
    }
    LocalPlayer_CreatedPlayerFoods() {
        if (!this.playersManager.LocalPlayer.CanCreateFood()) {
            return;
        }
        this.server.RPC_CreatePlayerFood(GetMousePosition());
    }
    CheckFoodPointIntersect() {
        let removedFoods = this.gameMap.CheckFoodPointsIntersect(this.playersManager.LocalPlayerIsAlive, this.playersManager.LocalPlayer);
        if (removedFoods.length > 0) {
            this.LocalPlayer_AteFood(removedFoods);
        }
    }
    CheckThornsIntersect() {
        let removedThorns = this.gameMap.CheckThornsIntersect(this.playersManager.LocalPlayerIsAlive, this.playersManager.LocalPlayer);
        if (removedThorns.length > 0) {
            this.LocalPlayer_AteThorn(removedThorns);
        }
    }
    ProcessOfKillingPlayer(killerId, enemyId) {
        let killer = this.playersManager.GetPlayer(killerId);
        let enemy = this.playersManager.GetPlayer(enemyId);
        if (!killer || !enemy) {
            return;
        }
        if (killer.isInCamera() && enemy.isInCamera()) {
            let enemyIsLocalPlayer = this.playersManager.IsLocalPlayer(enemyId);
            enemy.moveToC(killer.getPositionC(), 7, 7);
            if (enemy.IsAlive()) {
                enemy.Die();
                enemy.SetKiller(killer.GetServerId());
                this.audioManager.Die();
                if (enemyIsLocalPlayer) {
                    this.menu.Show();
                }
            }
            if (killer.getDistanceC(enemy.getPositionC()) <= 10) {
                if (enemyIsLocalPlayer) {
                    this.playersManager.RemovePlayer(this.playersManager.LocalPlayer.GetServerId());
                    return;
                }
                this.playersManager.RemovePlayer(enemy.GetServerId());
            }
            return;
        }
        this.playersManager.RemovePlayer(enemy.GetServerId());
    }
    UpdateLocalPlayer() {
        if (!this.playersManager.LocalPlayerIsAlive) {
            return;
        }
        let localPlayer = this.playersManager.LocalPlayer;
        if (localPlayer.GetKiller()) {
            this.ProcessOfKillingPlayer(localPlayer.GetKiller(), localPlayer.GetServerId());
            this.gameMap.AddGameObjectToRender(localPlayer);
            return;
        }
        localPlayer.ProcessUpdateRadius();
        localPlayer.UpdatePointToMove(GetMousePosition());
        localPlayer.UpdateSpeed();
        localPlayer.UpdateNickname();
        if (this.gameMap.CheckMapMapBorder(localPlayer.getPositionC(), localPlayer.GetPos())) {
            this.server.RPC_UpdatePOS(new ClientDataSchemas.UpdatePos(localPlayer.x, localPlayer.y, localPlayer.GetPos()));
            localPlayer.Move();
            Camera.follow(localPlayer, localPlayer.GetSpeed() + 1);
        }
        this.gameMap.AddGameObjectToRender(localPlayer);
    }
    CheckEnemyIntersect(enemy) {
        if ((this.playersManager.LocalPlayer.radius > enemy.radius + 3)
            && this.playersManager.LocalPlayer.isStaticIntersect(enemy)
            && this.playersManager.LocalPlayer.getDistanceC(enemy.getPositionC()) <= this.playersManager.LocalPlayer.radius) {
            if (enemy.alive) {
                this.LocalPlayer_AteEnemy(enemy);
            }
            this.ProcessOfKillingPlayer(this.playersManager.LocalPlayer.GetServerId(), enemy.GetServerId());
            return true;
        }
        return false;
    }
    UpdateEnemies() {
        for (let enemy of this.playersManager.EnemiesIterator) {
            enemy.TryFixPosition();
            if (enemy.isInCamera()) {
                if (enemy.GetKiller()) {
                    this.ProcessOfKillingPlayer(enemy.GetKiller(), enemy.GetServerId());
                    this.gameMap.AddGameObjectToRender(enemy);
                    continue;
                }
                if (this.playersManager.LocalPlayerIsAlive && this.CheckEnemyIntersect(enemy)) {
                    this.gameMap.AddGameObjectToRender(enemy);
                    continue;
                }
                enemy.ProcessUpdateRadius();
                enemy.UpdateNickname();
                if (enemy.CheckDistanceToPos()) {
                    enemy.UpdateSpeed();
                    if (this.gameMap.CheckMapMapBorder(enemy.getPositionC(), enemy.GetPos())) {
                        enemy.Move();
                    }
                }
                this.gameMap.AddGameObjectToRender(enemy);
                continue;
            }
            enemy.TeleportToDefaultPos();
        }
    }
    SetCameraPosOverLocalPlayer() {
        Camera.setPositionC(this.playersManager.LocalPlayer.getPositionC());
    }
}
GameControl.instance = null;
