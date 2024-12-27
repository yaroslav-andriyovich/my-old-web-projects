import { Player } from './@imports.js';
export class LocalPlayer extends Player {
    constructor(params) {
        super(params);
        this.GetMaxScore = () => this.maxScore;
        this.UpdateMaxScore = () => {
            if (this.score > this.maxScore) {
                this.maxScore = this.score;
            }
        };
        this.CanCreateFood = () => (this.alive || this.radius > Player.MinRadiusToCreateFood);
        this.UpdateScore = (newScore) => {
            this.score = newScore;
            this.UpdateMaxScore();
        };
        this.UpdatePointToMove = (newPointToMove) => {
            this.distance = this.getDistanceC(newPointToMove);
            this.pointToMove = newPointToMove;
        };
        this.maxScore = params.score;
    }
}
