import { Player, LocalPlayer } from './@imports.js';
export class PlayersManager {
    constructor() {
        this.enemies = new Map();
    }
    static get Instance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
    get Enemies() {
        return this.enemies;
    }
    get EnemiesIterator() {
        return this.enemies.values();
    }
    get EnemiesToLedearBoard() {
        return Array.from(this.enemies, ([id, player]) => { return player.ToLedearboard(); });
    }
    get LocalPlayer() {
        return this.localPlayer;
    }
    get LocalPlayerIsAlive() {
        return this.localPlayer && Object.keys(this.localPlayer).length !== 0;
    }
    IsLocalPlayer(playerId) {
        return (this.localPlayerId == playerId);
    }
    SetLocalPlayerId(newLocalPlayerId) {
        this.localPlayerId = newLocalPlayerId;
    }
    ClearLocalPlayerServerID() {
        this.localPlayerId = undefined;
    }
    CreateLocalPlayer(params) {
        this.localPlayer = new LocalPlayer(Object.assign({}, params));
    }
    CreateEnemyPlayer(params) {
        let newEnemyPlayer = new Player(Object.assign({}, params));
        this.enemies.set(newEnemyPlayer.GetServerId(), newEnemyPlayer);
        return newEnemyPlayer;
    }
    RemovePlayer(playerId) {
        if (this.IsLocalPlayer(playerId)) {
            this.localPlayer = null;
            return;
        }
        this.enemies.delete(playerId);
    }
    GetPlayer(playerId) {
        return this.IsLocalPlayer(playerId) ? this.localPlayer : this.enemies.get(playerId);
    }
    Clear() {
        var _a;
        this.RemovePlayer((_a = this.localPlayer) === null || _a === void 0 ? void 0 : _a.GetServerId());
        this.enemies.clear();
    }
}
PlayersManager.instance = null;
