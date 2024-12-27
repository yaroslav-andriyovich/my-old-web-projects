import { Game, System, Camera, VectorPoint, GetMousePosition, MouseControl, KeyControl, GetPercentage, Menu, AudioManager, Server, GameMap, Player, LocalPlayer, Debugger, Leaderboard } from './@imports.js';
import { ClientDataSchemas, ServerDataSchemas } from './client_server/index.js';

export class PlayersManager
{
    private static instance: PlayersManager = null;

    private enemies: Map<string, Player>;
    private localPlayerId: string;
    private localPlayer: LocalPlayer;

    private constructor()
    {
        this.enemies = new Map();
    }

    public static get Instance(): PlayersManager
    {
        if (!this.instance)
        {
            this.instance = new this();
        }
        
        return this.instance;
    }

    public get Enemies(): Map<string, Player>
    {        
        return this.enemies;
    }

    public get EnemiesIterator(): IterableIterator<Player>
    {
        return this.enemies.values();
    }

    public get EnemiesToLedearBoard(): Array<ServerDataSchemas.IPlayerLedearboard>
    {
        return Array.from(this.enemies, ([id, player]) => { return player.ToLedearboard() });
    }

    public get LocalPlayer(): LocalPlayer
    {        
        return this.localPlayer;
    }

    public get LocalPlayerIsAlive(): boolean
    {
        return this.localPlayer && Object.keys(this.localPlayer).length !== 0;
    }

    public IsLocalPlayer(playerId: string): boolean
    {
        return (this.localPlayerId == playerId);
    }

    public SetLocalPlayerId(newLocalPlayerId: string): void
    {
        this.localPlayerId = newLocalPlayerId;
    }

    public ClearLocalPlayerServerID(): void
    {
        this.localPlayerId = undefined;
    }

    public CreateLocalPlayer(params: Object): void
    {
        this.localPlayer = new LocalPlayer({ ...params });
    }

    public CreateEnemyPlayer(params: Object): Player
    {
        let newEnemyPlayer = new Player({ ...params });
        this.enemies.set(newEnemyPlayer.GetServerId(), newEnemyPlayer);
        return newEnemyPlayer;
    }

    public RemovePlayer(playerId: string): void
    {   
        if (this.IsLocalPlayer(playerId))
        {
            this.localPlayer = null; 
            return;
        }

        this.enemies.delete(playerId);
    }

    public GetPlayer(playerId: string): Player
    {
        return this.IsLocalPlayer(playerId) ? this.localPlayer : this.enemies.get(playerId);
    }

    public Clear(): void
    {
        this.RemovePlayer(this.localPlayer?.GetServerId());
        this.enemies.clear();
    }
}