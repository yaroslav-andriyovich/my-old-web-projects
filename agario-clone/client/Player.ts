import { VectorPoint, TextObject, CircleObject, GetPercentage } from './@imports.js';
import { Vector2 } from './client_server/DataTypes.js';
import { ServerDataSchemas } from './client_server/index.js';

export class Player extends CircleObject
{
    public static MaxRadius: number;
    public static MinRadiusToCreateFood: number;

    protected serverId: string;
    protected serverRadius: number;
    protected maxPlayerRadius: number;
    protected pointToMove: Vector2;
    /** Дистанция до this.pointToMove */
    protected distance: number;
    /** Координата X игрока на сервере */
    protected serverX: number;
    /** Координата Y игрока на сервере */
    protected serverY: number;
    protected fillColor: string;
    protected speed: number;
    protected score: number;
    protected alive: boolean;
    protected killer: string;
    /** Объект никнейма игрока */
    protected nickname: any;
    protected nicknameLength: number;

    constructor(params: any)
    {
        super(params);

        this.pointToMove = params.pointToMove;
        this.distance = 0;
        this.serverX = params.x;
        this.serverY = params.y;
        this.serverId = params.id;
        this.serverRadius = params.radius;
        this.speed = params.speed;
        this.score = params.score;
        this.alive = params.alive;
        this.killer = "";
        this.maxPlayerRadius = params.maxPlayerRadius;

        this.nicknameLength = params.name?.length;

        if (this.nicknameLength)
        {
            this.nickname = new TextObject({
                align: "center",
                size: 18,
                alpha: 1,
                color: "#fff",
                font: "cursive",
                strokeWidthText: 0.3,
                style: "bold",
                text: params.name,
                shadowColor : "black", 
                shadowBlur : 1, 
                shadowX : 0, 
                shadowY : 0 
            });
        }
    }

    public GetServerId = () => this.serverId;

    public GetPos = () => this.pointToMove;

    public SetPos = (params) =>
    {
        this.pointToMove = params.pointToMove;
        this.serverX = params.x;
        this.serverY = params.y;
    }

    public GetScore = (): number => this.score;

    public GetKiller = (): string => this.killer;

    public SetKiller = (id: string) => this.killer = id;

    public IsAlive = (): boolean => this.alive;
    
    public HasNickname = (): boolean => (this.nicknameLength > 0);

    public GetNickname = (): string => (this.HasNickname()) ? this.nickname.text : "Player";

    public GetSpeed = (): number => this.speed;

    public GetRadius = (): number => this.radius;

    public ToLedearboard = (): ServerDataSchemas.IPlayerLedearboard => 
    {
        return {
            id: this.serverId,
            nickname: this.GetNickname(),
            score: this.score
        };
    }

    public Die = () => 
    {
        this.alive = false;
    }

    public TryFixPosition = () =>
    {
        if (isNaN(this.x) || isNaN(this.y))
        {
            this.TeleportToDefaultPos();
        }
    }

    public TeleportToDefaultPos = () =>
    {
        this.x = this.serverX;
        this.y = this.serverY;
    }

    public IsRadiusPeaked = () => 
    {
        return (this.radius >= this.maxPlayerRadius);
    }

    private SetRadius = (value: number) => 
    {
        this.serverRadius = value;

        if (!this.isInCamera())
        {
            this.setRadiusC(this.serverRadius);
        }
    }

    protected UpdateScore = (value: number) => 
    {
        this.score = value;
    }

    /** Плавное увеличение радиуса */
    public ProcessUpdateRadius = () =>
    {
        if (this.radius > this.serverRadius)
        {
            return this.setRadiusC(this.serverRadius);
        }

        if (this.radius < this.serverRadius)
        {
            return this.setRadiusC(this.radius + 0.1);
        }
    }

    public CheckDistanceToPos = (newPointToMove?: Vector2): boolean  =>
    {
        this.distance = this.getDistanceC(this.pointToMove);

        // Вернуть булевое значение, больше ли текущая дистанция
        // больше чем 40% значене радиуса текущего игрока
        return this.distance > GetPercentage(40, this.radius);
    }

    public UpdateSpeed = () =>
    {
        let newSpeed = this.distance / this.radius;
        let maxSpeed = 3.5 - (this.radius * 0.0080);

        this.speed = (newSpeed > maxSpeed) ? maxSpeed : newSpeed;

        //console.log(this.radius)
    }

    public UpdateNickname = () =>
    {
        if (!this.nicknameLength)
        {
            return;
        }

        this.nickname.setSize(this.radius / (this.nicknameLength / 3));
        this.nickname.setPositionC(VectorPoint(this.x + this.radius + 4.5, this.y + this.radius + 5));
    }

    public Move = () => 
    {
        this.moveToC(this.pointToMove, this.speed, this.speed);
    }

    public UpdateData = (radius: number, score: number) => 
    {
        this.SetRadius(radius);
        this.UpdateScore(score);
    }
}