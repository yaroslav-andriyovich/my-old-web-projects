import { FoodPoint, Thorn, Tile, PlayersManager } from './@imports.js';
export class GameMap {
    constructor() {
        this.tileImage = "images/tile.png";
        this.tiles = new Array();
        this.foodPoints = new Map();
        this.thorns = new Map();
        this.objectsForRendering = new Array();
    }
    static get Instance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new this();
        console.log("GameMap initialized.");
        return this.instance;
    }
    get MapSize() {
        return this.mapSize;
    }
    RemoveFoodPoints(removedFood) {
        for (let i in removedFood) {
            this.foodPoints.delete(removedFood[i]);
        }
    }
    RemoveThorns(removedThorns) {
        for (let i in removedThorns) {
            this.thorns.delete(removedThorns[i]);
        }
    }
    Clear() {
        this.foodPoints.clear();
        this.thorns.clear();
        this.tiles = [];
    }
    GenerateTiles() {
        for (let x = -1; x <= this.tileCount; x++) {
            for (let y = -1; y <= this.tileCount; y++) {
                if (((y == -1 || y == this.tileCount) || (x == -1 || x == this.tileCount))) {
                    this.tiles.push(new Tile({
                        file: this.tileImage,
                        w: this.tileSize,
                        h: this.tileSize,
                        x: this.tileSize * x,
                        y: this.tileSize * y,
                        alpha: 0.4
                    }));
                    continue;
                }
                this.tiles.push(new Tile({
                    file: this.tileImage,
                    w: this.tileSize,
                    h: this.tileSize,
                    x: this.tileSize * x,
                    y: this.tileSize * y,
                    alpha: 1
                }));
            }
        }
    }
    AddNewFoodPoints(data) {
        let foodsMap = new Map(data.newFoods);
        foodsMap.forEach(food => {
            if (food.ownerId) {
                let owner = PlayersManager.Instance.GetPlayer(food.ownerId);
                if (owner) {
                    let ownerPosition = owner.getPositionC();
                    food.x = ownerPosition.x;
                    food.y = ownerPosition.y;
                }
            }
            this.foodPoints.set(food.id, new FoodPoint(food));
        });
    }
    AddNewThorns(data) {
        let thornsMap = new Map(data.thorns);
        thornsMap.forEach(thorn => {
            this.thorns.set(thorn.id, new Thorn(thorn));
        });
    }
    CreateMap(params) {
        this.Clear();
        this.mapSize = params.map_size;
        this.minMapEdge = params.map_min_edge;
        this.tileSize = params.tile_size;
        this.tileCount = params.tile_count;
        this.GenerateTiles();
        this.AddNewFoodPoints(params.foodPoints);
        this.AddNewThorns(params.thorns);
    }
    DrawTiles() {
        this.tiles.forEach((tile) => {
            if (tile.isInCamera())
                tile.draw();
        });
    }
    CheckMapMapBorder(center, pos) {
        return (center.x >= -this.minMapEdge
            && center.x <= this.mapSize + this.minMapEdge
            && center.y >= -this.minMapEdge
            && center.y <= this.mapSize + this.minMapEdge)
            || (pos.x >= -this.minMapEdge
                && pos.x <= this.mapSize + this.minMapEdge
                && pos.y >= -this.minMapEdge
                && pos.y <= this.mapSize + this.minMapEdge);
    }
    AddGameObjectToRender(gameObj) {
        this.objectsForRendering.push(gameObj);
    }
    ClearGameObjectsForRendering() {
        this.objectsForRendering = [];
    }
    RenderGameObjects() {
        this.objectsForRendering.sort((a, b) => a.radius - b.radius);
        for (let gameObj of this.objectsForRendering) {
            gameObj.draw();
            if (gameObj.alpha < 1) {
                gameObj.transparent(0.1);
            }
            if (gameObj.nicknameLength) {
                gameObj.nickname.draw();
            }
            if (gameObj.ownerId && !gameObj.InPosition()) {
                gameObj.MoveToTarget();
            }
        }
    }
    CheckFoodPointsIntersect(localPlayerIsAlive, localPlayer) {
        let removedFoods = [];
        this.foodPoints.forEach(food => {
            if (food.isInCamera()) {
                if (localPlayerIsAlive
                    && !localPlayer.IsRadiusPeaked()
                    && localPlayer.isStaticIntersect(food)
                    && (food.GetOwnerId() != localPlayer.GetServerId() || food.InPosition())
                    && localPlayer.getDistanceC(food.getPositionC()) <= localPlayer.radius) {
                    removedFoods.push(food.GetServerID());
                }
                else {
                    this.AddGameObjectToRender(food);
                }
            }
        });
        this.RemoveFoodPoints(removedFoods);
        return removedFoods;
    }
    CheckThornsIntersect(localPlayerIsAlive, localPlayer) {
        let removedThorns = [];
        this.thorns.forEach(thorn => {
            if (thorn.isInCamera()) {
                if (localPlayerIsAlive
                    && localPlayer.radius > thorn.radius
                    && !localPlayer.IsRadiusPeaked()
                    && localPlayer.isStaticIntersect(thorn)
                    && localPlayer.getDistanceC(thorn.getPositionC()) <= localPlayer.radius) {
                    removedThorns.push(thorn.GetServerID());
                    return;
                }
                this.AddGameObjectToRender(thorn);
            }
        });
        this.RemoveThorns(removedThorns);
        return removedThorns;
    }
}
GameMap.instance = null;
;
