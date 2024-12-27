import { CircleObject } from './Engine.js';
export class FoodPoint extends CircleObject {
    constructor(params) {
        super(params);
        this.inPosition = true;
        this.GetServerID = () => {
            return this.serverId;
        };
        this.InPosition = () => {
            return this.inPosition;
        };
        this.GetOwnerId = () => {
            return this.ownerId;
        };
        this.TeleportToTarget = () => {
            this.setPositionC(this.targetPosition);
            this.inPosition = true;
        };
        this.MoveToTarget = () => {
            if (this.isInCamera()) {
                if (this.getDistanceC(this.targetPosition) <= 3.8) {
                    this.TeleportToTarget();
                    return;
                }
                this.moveToC(this.targetPosition, 7.6, 7.6);
                return;
            }
            this.TeleportToTarget();
        };
        this.serverId = params.id;
        this.alpha = 0;
        this.ownerId = params.ownerId;
        this.targetPosition = params.targetPosition;
        if (this.ownerId) {
            this.inPosition = false;
        }
    }
}
