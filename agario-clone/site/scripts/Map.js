import { FoodPoint, Thorn, Tile } from './@imports.js';
export class GameMap {
    constructor() {
        this.tileImage = "images/tile.png";
        this.tiles = new Array();
        this.foodPoints = new Map();
        this.thorns = new Map();
        this.objectsForRendering = new Array();
        if (GameMap.instance) {
            return GameMap.instance;
        }
        GameMap.instance = this;
        console.log("GameMap initialized.");
    }
    get MapSize() {
        return this.mapSize;
    }
    RemoveFoodPoints(removedFood) {
        for (let i in removedFood) {
            this.foodPoints.delete(removedFood[i]);
        }
    }
    Clear() {
        this.foodPoints.clear();
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
        }
    }
    CheckFoodPointsIntersect(localPlayerIsAlive, localPlayer) {
        let removedFoods = [];
        this.foodPoints.forEach(food => {
            if (food.isInCamera()) {
                if (localPlayerIsAlive
                    && !localPlayer.IsRadiusPeaked()
                    && localPlayer.isStaticIntersect(food)
                    && localPlayer.getDistanceC(food.getPositionC()) <= localPlayer.radius) {
                    let foodId = food.GetServerID();
                    removedFoods.push(foodId);
                    return;
                }
                this.AddGameObjectToRender(food);
            }
        });
        this.RemoveFoodPoints(removedFoods);
        return removedFoods;
    }
}
GameMap.instance = null;
;
