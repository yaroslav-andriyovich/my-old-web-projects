import { Game, System, Camera, VectorPoint, GetMousePosition, MouseControl, KeyControl, Menu, AudioManager, Server, GameMap, Player, LocalPlayer, Debugger, Leaderboard } from './@imports.js';
import { ClientDataSchemas } from './client_server/index.js';
export class GameProcess {
    constructor() {
        this.enemies = new Map();
        this.cameraZoomValue = 0;
        this.minPlayerScore = 10;
    }
    static get Instance() {
        return this.instance;
    }
    static Initialize(socketFromServer) {
        if (this.instance) {
            throw new Error("GameProcess already initialized!");
        }
        this.instance = new this();
        Server.Initialize(socketFromServer);
        this.instance.server = Server.Instance;
        this.instance.audioManager = AudioManager.Instance;
        this.instance.menu = Menu.Instance;
        this.instance.gameMap = GameMap.Instance;
        this.instance.debugger = Debugger.Instance;
        this.instance.leaderboard = Leaderboard.Instance;
        console.log("GameProcess initialized.");
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
        let player = this.GetPlayer(data.id);
        if (!player) {
            return;
        }
        player.UpdateData(data.radius, data.score);
        this.leaderboard.UpdatePlayer(player.ToLedearboard());
        if (this.IsLocalPlayer(data.id)) {
            this.menu.UpdateScore(player.GetMaxScore());
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
        this.minPlayerRadiusForEdiblePlayerPart = data.server_settings.min_player_radius_for_ediblePlayerPart;
        Game.setLoop("game");
        Game.start();
        System.initFPSCheck();
        System.initFullPage();
        this.gameMap.CreateMap(data.map);
        let mapDividedSize = this.gameMap.MapSize / 2;
        Camera.setPositionC(VectorPoint(mapDividedSize, mapDividedSize));
        this.AddAllEnemies(data.enemies);
        this.leaderboard.Initialize(this.EnemiesToLedearBoard);
        this.menu.Show(false);
    }
    SpawnLocalPlayer(params) {
        this.localPlayer = new LocalPlayer(Object.assign(Object.assign({}, params), { maxPlayerRadius: this.maxPlayerRadius }));
        this.leaderboard.AddLocalPlayer(this.localPlayer.ToLedearboard());
        this.SetCameraPosOverLocalPlayer();
        this.menu.UpdateScore(this.localPlayer.GetMaxScore());
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
        if (this.localPlayer.IsRadiusPeaked()) {
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
        if (!this.localPlayer.IsAlive() || this.localPlayer.GetRadius() < this.minPlayerRadiusForEdiblePlayerPart) {
            return;
        }
        this.server.RPC_CreatePlayerFoods(GetMousePosition());
    }
    CheckFoodPointIntersect() {
        let removedFoods = this.gameMap.CheckFoodPointsIntersect(this.LocalPlayerIsAlive, this.localPlayer);
        if (removedFoods.length > 0) {
            this.LocalPlayer_AteFood(removedFoods);
        }
    }
    CheckThornsIntersect() {
        let removedThorns = this.gameMap.CheckThornsIntersect(this.LocalPlayerIsAlive, this.localPlayer);
        if (removedThorns.length > 0) {
            this.LocalPlayer_AteThorn(removedThorns);
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
                this.gameMap.AddGameObjectToRender(this.localPlayer);
            }
            return;
        }
        this.localPlayer.ProcessUpdateRadius();
        this.localPlayer.UpdatePointToMove(GetMousePosition());
        this.localPlayer.UpdateSpeed();
        this.localPlayer.UpdateNickname();
        if (this.gameMap.CheckMapMapBorder(this.localPlayer.getPositionC(), this.localPlayer.GetPos())) {
            this.server.RPC_UpdatePOS(new ClientDataSchemas.UpdatePos(this.localPlayer.x, this.localPlayer.y, this.localPlayer.GetPos()));
            this.localPlayer.Move();
            Camera.follow(this.localPlayer, this.localPlayer.GetSpeed() + 1);
        }
        this.gameMap.AddGameObjectToRender(this.localPlayer);
    }
    CheckEnemyIntersect(enemy) {
        if ((this.localPlayer.radius > enemy.radius + 3)
            && this.localPlayer.isStaticIntersect(enemy)
            && this.localPlayer.getDistanceC(enemy.getPositionC()) <= this.localPlayer.radius) {
            if (enemy.alive) {
                this.LocalPlayer_AteEnemy(enemy);
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
                    this.gameMap.AddGameObjectToRender(enemy);
                    continue;
                }
                if (this.LocalPlayerIsAlive && this.CheckEnemyIntersect(enemy)) {
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
        Camera.setPositionC(this.localPlayer.getPositionC());
    }
}
GameProcess.instance = null;
