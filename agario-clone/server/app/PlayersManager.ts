import { Config, Player } from 'server';
import { RPC_Modes, DataTypes, ClientDataSchemas, ServerDataSchemas } from 'client_server';

export class PlayersManager
{
    private static instance: PlayersManager = null;

    private players: Map<string, Player>;

    private constructor()
    {
        this.players = new Map();
    }

    public static get Instance(): PlayersManager
    {
        if (!this.instance)
        {
            this.instance = new this();
        }
        
        return this.instance;
    }

    public AddPlayer(clientId: string): Player
    {
        let newPlayer = new Player(clientId);
        this.players.set(newPlayer.Id, newPlayer);
        return newPlayer;
    }

    public RemovePlayer(clientId: string): void
    {
        this.players.delete(clientId);
    }

    public GetPlayer(clientId: string): Player
    {
        return this.players.get(clientId);
    }

    public GetAllExceptLocal(playerId: string): Array<[string, ServerDataSchemas.PlayerToRender]>
    {
        let playersMap: Map<string, ServerDataSchemas.PlayerToRender> = new Map();

        this.players.forEach((player) =>
        {
            if (player.Alive && player.Id !== playerId)
            {
                playersMap.set(player.Id, player.ToRender);
            }
        });

        return Array.from(playersMap);
    }
}