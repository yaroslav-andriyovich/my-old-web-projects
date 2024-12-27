import { defaultNumber, defaultString, Vector2 } from './DataTypes.js';
import { DataTypes } from './index.js';
export class Empty {
    constructor() {
    }
}
Empty.ForValidation = new Empty();
export class UpdatePos {
    constructor(x, y, pointToMove) {
        this.x = x;
        this.y = y;
        this.pointToMove = pointToMove;
    }
}
UpdatePos.ForValidation = new UpdatePos(defaultNumber, defaultNumber, new Vector2(defaultNumber, defaultNumber));
export class Spawn {
    constructor(nickname) {
        this.nickname = nickname;
    }
}
Spawn.ForValidation = new Spawn(defaultString);
export class AteFood {
    constructor(removedFoods) {
        this.removedFoods = Object.assign({}, removedFoods);
    }
}
AteFood.ForValidation = new AteFood([]);
export class AteThorn {
    constructor(removedThorns) {
        this.removedThorns = Object.assign({}, removedThorns);
    }
}
AteThorn.ForValidation = new AteThorn([]);
export class AteEnemy {
    constructor(enemyId) {
        this.enemyId = enemyId;
    }
}
AteEnemy.ForValidation = new AteEnemy(defaultString);
export class CreatePlayerFoods {
    constructor(mousePosition) {
        this.mousePosition = mousePosition;
    }
}
CreatePlayerFoods.ForValidation = new CreatePlayerFoods(new DataTypes.Vector2(0, 0));
