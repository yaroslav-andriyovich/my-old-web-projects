import { DataTypes } from "client_server";

export class Event
{
    public readonly command: string;
    public readonly data: Object;

    constructor(command: string, data: Object)
    {
        this.command = command;
        this.data = data;
    }
}

export class MultipleEvents
{
    private events: Event[];

    public get Events(): Event[]
    {
        return this.events;
    }

    public Add(command: string, data: Object): MultipleEvents
    {
        this.events.push(new Event(command, data));
        return this;
    }
}

export class PlayerToRender
{
    public readonly name: string;
    public readonly fillColor: string;
    public readonly strokeColor: string;
    public readonly strokeWidth: number;
    public readonly id: string;
    public readonly x: number;
    public readonly y: number;
    public readonly pointToMove: DataTypes.Vector2;
    public readonly radius: number;
    public readonly score: number;
    public readonly speed: number;
    public readonly alive: boolean;

    constructor (name: string, fillColor: string, strokeColor: string, strokeWidth: number, id: string, x: number, y: number, pointToMove: DataTypes.Vector2, radius: number, score: number, speed: number, alive: boolean)
    {
        this.name = name;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.id = id;
        this.x = x;
        this.y = y;
        this.pointToMove = pointToMove;
        this.radius = radius;
        this.score = score;
        this.speed = speed;
        this.alive = alive;
    }
}

export class FoodToRender
{
    public readonly id: string;
    public x: number;
    public y: number;
    public readonly radius: number;
    public readonly fillColor: string;
    public readonly ownerId: string;
    public targetPosition: DataTypes.Vector2;

    constructor(id: string, position: DataTypes.Vector2, radius: number, fillColor: string, ownerId: string, targetPosition: DataTypes.Vector2)
    {
        this.id = id;
        this.x = position.x;
        this.y = position.y;
        this.radius = radius;
        this.fillColor = fillColor;
        this.ownerId = ownerId;
        this.targetPosition = targetPosition;
    }
}

export class ThornToRender
{
    public readonly id: string;
    public readonly x: number;
    public readonly y: number;
    public readonly radius: number;

    constructor(id: string, x: number, y: number, radius: number)
    {
        this.id = id;
        this.x = x; 
        this.y = y;
        this.radius = radius;
    }
}

export class UpdatePlayerPos
{
    readonly pointToMove: DataTypes.Vector2;
    readonly x: number;
    readonly y: number;
    readonly id: string;

    constructor (pointToMove: DataTypes.Vector2, x: number, y: number, id: string)
    {
        this.pointToMove = pointToMove;
        this.x = x;
        this.y = y;
        this.id = id;
    }
}

export class Ping
{
    public readonly time: number;

    constructor ()
    {
        this.time = new Date().getTime();
    }
}

export class UpdateOnline
{
    public readonly online: string;

    constructor (online: number | string)
    {
        this.online = online.toString();
    }
}

export class UpdatePlayer
{
    public readonly id: string;
    public readonly radius: number;
    public readonly score: number;

    constructor (id: string, radius: number, score: number)
    {
        this.id = id;
        this.radius = radius;
        this.score = score;
    }
}

export class PlayerDisconnected
{
    public readonly id: string;
    public readonly onlineInfo: UpdateOnline;

    constructor (id: string, onlineInfo: UpdateOnline)
    {
        this.id = id;
        this.onlineInfo = onlineInfo;
    }
}

export class AteFood
{
    public readonly removedFoods: string[];
    public readonly player: UpdatePlayer;

    constructor (removedFoods: string[], player: UpdatePlayer)
    {
        this.removedFoods = removedFoods;
        this.player = player;
    }
}

export class AteThorn
{
    public readonly removedThorns: string[];
    public readonly player: UpdatePlayer;

    constructor (removedThorns: string[], player: UpdatePlayer)
    {
        this.removedThorns = removedThorns;
        this.player = player;
    }
}

export class AteEnemy
{
    public readonly enemyId: string;
    public readonly killer: UpdatePlayer;

    constructor (enemyId: string, killer: UpdatePlayer)
    {
        this.enemyId = enemyId;
        this.killer = killer;
    }
}

export class NewFoods
{
    public readonly newFoods: [string, FoodToRender][];

    constructor (newFoods: [string, FoodToRender][])
    {
        this.newFoods = newFoods;
    }
}

export class NewThorns
{
    public readonly thorns: [string, ThornToRender ][];

    constructor (thorns: [string, ThornToRender ][])
    {
        this.thorns = thorns;
    }
}

export class MapInitialization
{
    public readonly map: 
    {
        map_size: number,
        map_min_edge: number,
        tile_size: number,
        tile_count: number,
        foodPoints: NewFoods,
        thorns: NewThorns
    };
    public readonly enemies: Array<[string, PlayerToRender]>; 
    public readonly local_id: string; 
    public readonly server_settings: 
    {
        player_scale_value: number,
        min_player_radius: number,
        max_player_radius: number,
        min_player_radius_for_ediblePlayerPart: number
    };

    constructor (map_size: number, map_min_edge: number, tile_size: number, tile_count: number, foodPoints: NewFoods, thorns: NewThorns, enemies: Array<[string, PlayerToRender]>, local_id: string, player_scale_value: number, min_player_radius: number, max_player_radius: number, min_player_radius_for_ediblePlayerPart: number)
    {
        this.map = 
        {
            map_size: map_size,
            map_min_edge: map_min_edge,
            tile_size: tile_size,
            tile_count: tile_count,
            foodPoints: foodPoints,
            thorns: thorns
        };

        this.enemies = enemies;

        this.local_id = local_id;

        this.server_settings = 
        {
            player_scale_value: player_scale_value,
            min_player_radius: min_player_radius,
            max_player_radius: max_player_radius,
            min_player_radius_for_ediblePlayerPart
        };
    }
}

export class NewPlayerFood
{
    public readonly newFoods: NewFoods;
    public readonly ownerData: UpdatePlayer;

    constructor (newFoods: NewFoods, ownerData: UpdatePlayer)
    {
        this.newFoods = newFoods;
        this.ownerData = ownerData;
    }
}