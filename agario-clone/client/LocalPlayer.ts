import { Player } from './@imports.js';
import { Vector2 } from './client_server/DataTypes';

export class LocalPlayer extends Player
{
    private maxScore: number;

    constructor (params)
    {
        super(params);

        this.maxScore = params.score;
    }

    public GetMaxScore = () => this.maxScore;

    private UpdateMaxScore = (): void =>
    {
        if (this.score > this.maxScore)
        {
            this.maxScore = this.score;
        }
    }

    public CanCreateFood = (): boolean => (this.alive || this.radius > Player.MinRadiusToCreateFood);

    protected override UpdateScore = (newScore: number): void =>
    {
        this.score = newScore;
        this.UpdateMaxScore();
    }

    public UpdatePointToMove = (newPointToMove?: Vector2): void =>
    {
        this.distance = this.getDistanceC(newPointToMove);
        this.pointToMove = newPointToMove;
    }
}