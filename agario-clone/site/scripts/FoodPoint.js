import { CircleObject } from './Engine.js';
export class FoodPoint extends CircleObject {
    constructor(params) {
        super(params);
        this.GetServerID = () => {
            return this.serverId;
        };
        this.serverId = params.id;
        this.alpha = 0;
    }
}
