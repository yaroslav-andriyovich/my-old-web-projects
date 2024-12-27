import { Utils } from 'server';
import { DataTypes, ServerDataSchemas } from 'client_server';

export class Food
{
    protected id: string;
    protected position: DataTypes.Vector2;
    protected radius: number;
    protected fillColor: string;
    protected ownerId: string;
    protected targetPosition: DataTypes.Vector2;

    constructor(position: DataTypes.Vector2, radius: number, fillColor: string, ownerId?: string, targetPosition?: DataTypes.Vector2)
    {
        this.id = Utils.GenerateID();
        this.position = position;
        this.radius = radius;
        this.fillColor = fillColor;
        this.ownerId = ownerId;
        this.targetPosition = targetPosition;
    }

    public get Id(): string
    {
        return this.id;
    }

    public get ToRender(): ServerDataSchemas.FoodToRender
    {
        return new ServerDataSchemas.FoodToRender
        (
        this.id,
        this.position,
        this.radius,
        this.fillColor,
        this.ownerId,
        this.targetPosition
        );
    }
}