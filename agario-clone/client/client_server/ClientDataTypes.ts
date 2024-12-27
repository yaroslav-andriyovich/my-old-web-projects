import { 
    defaultNumber,
    defaultString,
    defaultBool,
    Vector2
} from './DataTypes.js';
import { DataTypes } from './index.js';

export interface IPlayerLedearboard
{
    readonly id: string;
    readonly nickname: string;
    readonly score: number;
}

export class Empty
{
    public static readonly ForValidation = new Empty();

    constructor ()
    {
    }
}

export class UpdatePos
{
    public static readonly ForValidation = new UpdatePos(defaultNumber, defaultNumber, new Vector2(defaultNumber, defaultNumber));

    public readonly x: number;
    public readonly y: number;
    public readonly pointToMove: Vector2;

    constructor (x: number, y: number, pointToMove: Vector2)
    {
        this.x = x;
        this.y = y;
        this.pointToMove = pointToMove;
    }
}

export class Spawn
{
    public static readonly ForValidation = new Spawn(defaultString);

    public readonly nickname: string;

    constructor (nickname: string)
    {
        this.nickname = nickname;
    }
}

export class AteFood
{
    public static readonly ForValidation = new AteFood([]);

    public readonly removedFoods: Array<string>;

    constructor (removedFoods: Array<string>)
    {
        this.removedFoods = { ...removedFoods };
    }
}

export class AteThorn
{
    public static readonly ForValidation = new AteThorn([]);

    public readonly removedThorns: Array<string>;

    constructor (removedThorns: Array<string>)
    {
        this.removedThorns = { ...removedThorns };
    }
}

export class AteEnemy
{
    public static readonly ForValidation = new AteEnemy(defaultString);

    public readonly enemyId: string;

    constructor (enemyId: string)
    {
        this.enemyId = enemyId;
    }
}

export class CreatePlayerFoods
{
    public static readonly ForValidation = new CreatePlayerFoods(new DataTypes.Vector2(0, 0));

    public readonly mousePosition: DataTypes.Vector2;

    constructor (mousePosition: DataTypes.Vector2)
    {
        this.mousePosition = mousePosition;
    }
}