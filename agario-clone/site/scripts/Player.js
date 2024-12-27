import { VectorPoint, TextObject, CircleObject, GetPercentage } from './@imports.js';
export class Player extends CircleObject {
    constructor(params) {
        var _a;
        super(params);
        this.GetServerId = () => this.serverId;
        this.GetPos = () => this.pointToMove;
        this.SetPos = (params) => {
            this.pointToMove = params.pointToMove;
            this.serverX = params.x;
            this.serverY = params.y;
        };
        this.GetScore = () => this.score;
        this.GetKiller = () => this.killer;
        this.SetKiller = (id) => this.killer = id;
        this.IsAlive = () => this.alive;
        this.HasNickname = () => (this.nicknameLength > 0);
        this.GetNickname = () => (this.HasNickname()) ? this.nickname.text : "Player";
        this.GetSpeed = () => this.speed;
        this.GetRadius = () => this.radius;
        this.ToLedearboard = () => {
            return {
                id: this.serverId,
                nickname: this.GetNickname(),
                score: this.score
            };
        };
        this.Die = () => {
            this.alive = false;
        };
        this.TryFixPosition = () => {
            if (isNaN(this.x) || isNaN(this.y)) {
                this.TeleportToDefaultPos();
            }
        };
        this.TeleportToDefaultPos = () => {
            this.x = this.serverX;
            this.y = this.serverY;
        };
        this.IsRadiusPeaked = () => {
            return (this.radius >= this.maxPlayerRadius);
        };
        this.SetRadius = (value) => {
            this.serverRadius = value;
            if (!this.isInCamera()) {
                this.setRadiusC(this.serverRadius);
            }
        };
        this.UpdateScore = (value) => {
            this.score = value;
        };
        this.ProcessUpdateRadius = () => {
            if (this.radius > this.serverRadius) {
                return this.setRadiusC(this.serverRadius);
            }
            if (this.radius < this.serverRadius) {
                return this.setRadiusC(this.radius + 0.1);
            }
        };
        this.CheckDistanceToPos = (newPointToMove) => {
            this.distance = this.getDistanceC(this.pointToMove);
            return this.distance > GetPercentage(40, this.radius);
        };
        this.UpdateSpeed = () => {
            let newSpeed = this.distance / this.radius;
            let maxSpeed = 3.5 - (this.radius * 0.0080);
            this.speed = (newSpeed > maxSpeed) ? maxSpeed : newSpeed;
        };
        this.UpdateNickname = () => {
            if (!this.nicknameLength) {
                return;
            }
            this.nickname.setSize(this.radius / (this.nicknameLength / 3));
            this.nickname.setPositionC(VectorPoint(this.x + this.radius + 4.5, this.y + this.radius + 5));
        };
        this.Move = () => {
            this.moveToC(this.pointToMove, this.speed, this.speed);
        };
        this.UpdateData = (radius, score) => {
            this.SetRadius(radius);
            this.UpdateScore(score);
        };
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
        this.nicknameLength = (_a = params.name) === null || _a === void 0 ? void 0 : _a.length;
        if (this.nicknameLength) {
            this.nickname = new TextObject({
                align: "center",
                size: 18,
                alpha: 1,
                color: "#fff",
                font: "cursive",
                strokeWidthText: 0.3,
                style: "bold",
                text: params.name,
                shadowColor: "black",
                shadowBlur: 1,
                shadowX: 0,
                shadowY: 0
            });
        }
    }
}
