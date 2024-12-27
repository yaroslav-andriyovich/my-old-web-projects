import { Game, System, Camera, VectorPoint, GetMousePosition, MouseControl, Menu, AudioManager, Server, GameMap, Player, LocalPlayer, Debugger, Leaderboard } from './@imports.js';
import { ClientUpdatePosData, ServerUpdatePlayerData } from './client_server/index.js';
export class GameProcess {
    constructor(socketFromServer) {
        this.enemies = new Map();
        this.cameraZoomValue = 0;
        if (GameProcess.instance) {
            return GameProcess.instance;
        }
        GameProcess.instance = this;
        this.server = new Server(socketFromServer);
        this.audioManager = new AudioManager();
        this.menu = new Menu();
        this.mapController = new GameMap();
        this.debugger = new Debugger();
        this.leaderboard = new Leaderboard();
        console.log("GameProcess initialized.");
    }
    Initialize() {
        Game.newLoop("game", () => { this.ProcessFrame(); });
    }
    ProcessFrame() {
        if (!this.server.ConnectionState) {
            return;
        }
        this.UpdateZoom();
        this.mapController.DrawTiles();
        this.mapController.ClearGameObjectsForRendering();
        this.CheckFoodPointIntersect();
        this.UpdateEnemies();
        this.UpdateLocalPlayer();
        this.mapController.RenderGameObjects();
    }
    OnUpdatePlayerData(data) {
        let player = this.GetPlayer(data.id);
        if (!player) {
            return;
        }
        player.UpdateData(data.radius, data.score);
        this.leaderboard.UpdatePlayer(player.ToLedearboard());
        if (this.IsLocalPlayer(data.id)) {
            this.menu.UpdateScore(data.score);
        }
    }
    OnPlayerDisconnected(data) {
        this.RemovePlayer(data.id);
        this.menu.UpdateOnline(data.onlineInfo);
    }
    IsLocalPlayer(id) {
        return (this.localPlayerId == id);
    }
    get LocalPlayerIsAlive() {
        return this.localPlayer && Object.keys(this.localPlayer).length !== 0;
    }
    get EnemiesIterator() {
        return this.enemies.values();
    }
    get EnemiesToLedearBoard() {
        return Array.from(this.enemies, ([id, player]) => { return player.ToLedearboard(); });
    }
    GetPlayer(playerId) {
        return this.IsLocalPlayer(playerId) ? this.localPlayer : this.enemies.get(playerId);
    }
    AddAllEnemies(enemies) {
        new Map(enemies).forEach((enemy) => {
            this.AddEnemy(enemy);
        });
    }
    AddEnemy(newPlayer) {
        let player = new Player(Object.assign(Object.assign({}, newPlayer), { maxPlayerRadius: this.maxPlayerRadius }));
        this.enemies.set(newPlayer.id, player);
        this.leaderboard.AddNewPlayer(player.ToLedearboard());
    }
    RemovePlayer(id) {
        this.leaderboard.RemovePlayer(id);
        if (this.IsLocalPlayer(id)) {
            this.localPlayer = null;
            return;
        }
        this.enemies.delete(id);
    }
    ClearLocalPlayerServerID() {
        this.localPlayerId = undefined;
    }
    Clear() {
        this.RemovePlayer(this.localPlayerId);
        this.enemies.clear();
        this.leaderboard.Clear();
    }
    OnMapInit(data) {
        this.Clear();
        this.localPlayerId = data.local_id;
        this.playerScaleValue = data.server_settings.player_scale_value;
        this.minPlayerRadius = data.server_settings.min_player_radius;
        this.maxPlayerRadius = data.server_settings.max_player_radius;
        Game.setLoop("game");
        Game.start();
        System.initFPSCheck();
        System.initFullPage();
        this.mapController.CreateMap(data.map);
        let mapDividedSize = this.mapController.MapSize / 2;
        Camera.setPositionC(VectorPoint(mapDividedSize, mapDividedSize));
        this.AddAllEnemies(data.enemies);
        this.leaderboard.Initialize(this.EnemiesToLedearBoard);
        this.menu.Show(false);
    }
    SpawnLocalPlayer(params) {
        this.localPlayer = new LocalPlayer(Object.assign(Object.assign({}, params), { maxPlayerRadius: this.maxPlayerRadius }));
        this.leaderboard.AddLocalPlayer(this.localPlayer.ToLedearboard());
        this.SetCameraPosOverLocalPlayer();
        this.menu.UpdateScore(this.localPlayer.GetScore());
        this.menu.Hide();
    }
    OnNewPlayer(newPlayer) {
        if (this.IsLocalPlayer(newPlayer.id)) {
            this.SpawnLocalPlayer(newPlayer);
            return;
        }
        this.AddEnemy(newPlayer);
    }
    OnUpdateEnemyPos(player) {
        var _a;
        (_a = this.GetPlayer(player.id)) === null || _a === void 0 ? void 0 : _a.SetPos(player);
    }
    OnPlayerAteFood(data) {
        this.mapController.RemoveFoodPoints(data.removedFoods);
        this.OnUpdatePlayerData(data.player);
    }
    OnPlayerAteEnemy(data) {
        this.OnUpdatePlayerData(data.killer);
        this.ProcessOfKillingPlayer(data.killer.id, data.enemyId);
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
    LocalPlayerAteFood(removedFoods) {
        if (this.localPlayer.IsRadiusPeaked()) {
            return;
        }
        this.OnUpdatePlayerData(new ServerUpdatePlayerData(this.localPlayerId, this.localPlayer.radius + (this.playerScaleValue * removedFoods.length), this.localPlayer.GetScore() + removedFoods.length));
        this.server.RPC_AteFood(removedFoods);
    }
    LocalPlayerAteEnemy(enemy) {
        this.OnUpdatePlayerData(new ServerUpdatePlayerData(this.localPlayerId, this.localPlayer.IsRadiusPeaked() ? null : this.localPlayer.radius + (enemy.GetScore() / 2), this.localPlayer.GetScore() + enemy.GetScore()));
        this.server.RPC_AteEnemy(enemy.GetServerId());
    }
    CheckFoodPointIntersect() {
        let removedFoods = this.mapController.CheckFoodPointsIntersect(this.LocalPlayerIsAlive, this.localPlayer);
        if (removedFoods.length > 0) {
            this.LocalPlayerAteFood(removedFoods);
        }
    }
    ProcessOfKillingPlayer(killerId, enemyId) {
        let killer = this.GetPlayer(killerId);
        let enemy = this.GetPlayer(enemyId);
        if (!killer || !enemy) {
            return;
        }
        if (killer.isInCamera() && enemy.isInCamera()) {
            let enemyIsLocalPlayer = this.IsLocalPlayer(enemyId);
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
                    this.RemovePlayer(this.localPlayerId);
                    return;
                }
                this.RemovePlayer(enemy.GetServerId());
            }
            return;
        }
        this.RemovePlayer(enemy.GetServerId());
    }
    UpdateLocalPlayer() {
        if (!this.LocalPlayerIsAlive) {
            return;
        }
        if (this.localPlayer.GetKiller()) {
            this.ProcessOfKillingPlayer(this.localPlayer.GetKiller(), this.localPlayer.GetServerId());
            if (this.LocalPlayerIsAlive) {
                this.mapController.AddGameObjectToRender(this.localPlayer);
            }
            return;
        }
        this.localPlayer.ProcessUpdateRadius();
        if (this.localPlayer.CheckDistanceToPos(GetMousePosition())) {
            this.localPlayer.UpdateSpeed();
            if (this.mapController.CheckMapMapBorder(this.localPlayer.getPositionC(), this.localPlayer.GetPos())) {
                this.server.RPC_UpdatePOS(new ClientUpdatePosData(this.localPlayer.x, this.localPlayer.y, this.localPlayer.GetPos()));
                this.localPlayer.Move();
                this.localPlayer.CameraMove();
            }
            this.localPlayer.UpdateNickname();
        }
        this.mapController.AddGameObjectToRender(this.localPlayer);
    }
    CheckEnemyIntersect(enemy) {
        if ((this.localPlayer.radius > enemy.radius + 3)
            && this.localPlayer.isStaticIntersect(enemy)
            && this.localPlayer.getDistanceC(enemy.getPositionC()) <= this.localPlayer.radius) {
            if (enemy.alive) {
                this.LocalPlayerAteEnemy(enemy);
            }
            this.ProcessOfKillingPlayer(this.localPlayerId, enemy.GetServerId());
            return true;
        }
        return false;
    }
    UpdateEnemies() {
        for (let enemy of this.EnemiesIterator) {
            if (isNaN(enemy.x) || isNaN(enemy.y)) {
                enemy.TeleportToDefaultPos();
            }
            if (enemy.isInCamera()) {
                if (enemy.GetKiller()) {
                    this.ProcessOfKillingPlayer(enemy.GetKiller(), enemy.GetServerId());
                    this.mapController.AddGameObjectToRender(enemy);
                    continue;
                }
                if (this.LocalPlayerIsAlive && this.CheckEnemyIntersect(enemy)) {
                    this.mapController.AddGameObjectToRender(enemy);
                    continue;
                }
                enemy.ProcessUpdateRadius();
                if (enemy.CheckDistanceToPos()) {
                    enemy.UpdateSpeed();
                    if (this.mapController.CheckMapMapBorder(enemy.getPositionC(), enemy.GetPos())) {
                        enemy.Move();
                    }
                }
                enemy.UpdateNickname();
                this.mapController.AddGameObjectToRender(enemy);
                continue;
            }
            enemy.TeleportToDefaultPos();
        }
    }
    SetCameraPosOverLocalPlayer() {
        Camera.setPositionC(this.localPlayer.getPositionC());
    }
}
GameProcess.instance = null;
