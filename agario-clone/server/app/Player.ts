import { Config, Utils } from 'server';
import { RPC_Modes, DataTypes, ClientDataSchemas, ServerDataSchemas } from 'client_server';

export class Player
{
    private nickname: string;
    private fillColor: string;
    private strokeColor: string;
    private strokeWidth: number = 4;
    private id: string;
    private x: number;
    private y: number;
    private radius: number;
    private score: number;
    private maxScore: number;
    private speed: number = 3.5;
    private pointToMove: DataTypes.Vector2;
    private alive: boolean = false;

    constructor(socketId: string)
    {
        this.id = socketId;
    }

    public get Id(): string
    {
        return this.id;
    }

    public get Score(): number
    {
        return this.score;
    }

    public get MaxScore(): number
    {
        return this.maxScore;
    }

    public get Radius(): number
    {
        return this.radius;
    }

    public get Alive(): boolean
    {
        return this.alive;
    }

    public get Position(): DataTypes.Vector2
    {
        return new DataTypes.Vector2(this.x + this.radius, this.y + this.radius);
    }

    public get FillColor(): string
    {
        return this.fillColor;
    }

    public get IsRadiusPeaked(): boolean
    {
        return this.radius >= Config.max_player_radius;
    }

    public get ToRender(): ServerDataSchemas.PlayerToRender
    {
        return new ServerDataSchemas.PlayerToRender
        (
            this.nickname,
            this.fillColor,
            this.strokeColor,
            this.strokeWidth,
            this.id,
            this.x,
            this.y,
            this.pointToMove,
            this.radius,
            this.score,
            this.speed,
            this.alive
        );
    }

    public UpdatePosition(updatePosData: ClientDataSchemas.UpdatePos): ServerDataSchemas.UpdatePlayerPos
    {
        this.pointToMove = updatePosData.pointToMove; 
        this.x = updatePosData.x; 
        this.y = updatePosData.y;

        return new ServerDataSchemas.UpdatePlayerPos
        (
            this.pointToMove,
            this.x,
            this.y,
            this.id
        );
    }

    private AddRadius(value: number): void
    {
        this.radius += value * Config.player_scale_value;
    }

    private SubRadius(value: number): void
    {
        this.radius -= value * Config.player_scale_value;
    }

    private SetRadius(value: number): void
    {
        this.radius = value;
    }

    private AddScore(value: number): void
    {
        this.score += value * Config.player_score_mult;
        this.UpdateMaxScore();
    }

    private SubScore(value: number): void
    {
        this.score -= value * Config.player_score_mult; 
    }

    private SetScore(value: number): void
    {
        this.score = value;
        this.UpdateMaxScore();   
    }

    private UpdateMaxScore(): void
    {
        if (this.score > this.maxScore)
            this.maxScore = this.score;
    }

    public Die(): void
    {
        this.alive       = false;
        this.nickname    = "";
        this.fillColor   = "";
        this.strokeColor = "";
        this.x           = 0;
        this.y           = 0;
        this.pointToMove = new DataTypes.Vector2(0, 0);
        this.radius      = 0;
        this.score       = 0;
    }

    public Spawn(nickname: string): ServerDataSchemas.PlayerToRender
    {
        if (this.alive)
        {
            return;
        }

        this.nickname    = Utils.NicknameFilter(nickname);
        let color        = Utils.RandomColor();
        this.fillColor   = Utils.GetRGB(color);
        this.strokeColor = Utils.GetRGB(color, true);
        this.x           = Utils.RandomSpawnPoint();
        this.y           = Utils.RandomSpawnPoint();
        this.pointToMove = new DataTypes.Vector2(this.x, this.y);
        this.radius      = Config.min_player_radius;
        this.score       = Config.player_start_score;
        this.alive       = true;

        return this.ToRender;
    }

    public AteFood(amountFoodEaten: number): void
    {
        this.AddRadius(amountFoodEaten);
        this.AddScore(amountFoodEaten);
    }

    public AteThorn(): void
    {
        /* Временные действия */
        this.SetRadius(Config.min_player_radius);
        this.SetScore(Config.player_start_score);
    }

    public AteEnemy(enemyRadius: number, enemyScore: number): void
    {
        this.AddRadius(enemyRadius / 2);
        this.AddScore(enemyScore);
    }

    public CreatedOwnFood(): void
    {
        let value: number = Config.ediblePlayerPart_radius;

        this.SubRadius(value);
        this.SubScore(Math.round(value / 2));
    }
}