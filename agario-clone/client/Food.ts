import { CircleObject, VectorPoint } from './Engine.js';
import { DataTypes, ServerDataSchemas } from './client_server/index.js';

export class FoodPoint extends CircleObject
{
    private serverId: string;
    private ownerId: string;
    private targetPosition: DataTypes.Vector2;
    private inPosition: boolean = true;

    constructor(params: ServerDataSchemas.FoodToRender)
    {
        super(params);

        this.serverId = params.id;
        this.alpha = 0;
        this.ownerId = params.ownerId;
        this.targetPosition = params.targetPosition;

        if (this.ownerId)
        {
            this.inPosition = false;
        } 
    }

    public readonly GetServerID = () =>
    {
        return this.serverId;
    }

    public readonly InPosition = () =>
    {
        return this.inPosition;
    }

    public readonly GetOwnerId = () =>
    {
        return this.ownerId;
    }

    private TeleportToTarget = () =>
    {
        this.setPositionC(this.targetPosition);
        this.inPosition = true;     
    }

    public readonly MoveToTarget = () =>
    {
        if (this.isInCamera())
        {
            if (this.getDistanceC(this.targetPosition) <= 3.8)
            {
                this.TeleportToTarget();
                return;
            }

            this.moveToC(this.targetPosition, 7.6, 7.6);
            return;
        }

        this.TeleportToTarget();
    }
}