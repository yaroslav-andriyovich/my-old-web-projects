import { Config, Thorn, Utils } from 'server';
import { ServerDataSchemas } from 'client_server';

export class ThornManager
{
    private static instance: ThornManager = null;
    
    private thorns: Map<string, Thorn> = new Map();

    constructor()
    {
        if (ThornManager.instance)
        {
            return ThornManager.instance;
        }

        ThornManager.instance = this;
        this.Generate();
    }

    public get ListToSend(): ServerDataSchemas.NewThorns
    {
        let new_map: Map<string, ServerDataSchemas.ThornToRender> = new Map();

        this.thorns.forEach((thorn) =>
        {
            new_map.set(thorn.Id, thorn.ToRender);
        });

        return new ServerDataSchemas.NewThorns(Array.from(new_map));
    }

    public get Count(): number
    {
        return this.thorns.size;
    }

    public GetOne(id: string): Thorn
    {
        return this.thorns.get(id);
    }

    public Generate(): Array<[string, ServerDataSchemas.ThornToRender]>
    {
        let count = Config.max_thorns_count - this.Count;
        let newThorns: Map<string, ServerDataSchemas.ThornToRender> = new Map();

        for (let i = 0; i < count; i++)
        {
            let newThorn = new Thorn
            (
                Utils.GenerateID(),
                Utils.RandomSpawnPoint(),
                Utils.RandomSpawnPoint(),
                Utils.Random(Config.min_thorn_radius, Config.max_thorn_radius)
            );

            this.thorns.set(newThorn.Id, newThorn);
            newThorns.set(newThorn.Id, newThorn.ToRender);
        }
        
        return Array.from(newThorns);
    }

    public Remove(removedThorns: Array<string>): number
    {
        let removedCount = 0;

        for (let i in removedThorns)
        {
            if (!this.GetOne(removedThorns[i]))
            {
                continue;
            }

            this.thorns.delete(removedThorns[i]);
            removedCount++;
        }

        return removedCount;
    }
}