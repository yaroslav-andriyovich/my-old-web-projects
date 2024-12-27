import { FoodPoint, Thorn, Tile, LocalPlayer, PlayersManager, Player } from './@imports.js';
import { ServerDataSchemas } from './client_server/index.js';
import { Vector2 } from './client_server/DataTypes';
import { FoodToRender } from './client_server/ServerDataTypes.js';

export class GameMap
{
    private static instance: GameMap = null;

    private mapSize: number;
    private minMapEdge: number;
    private tileSize: number;
    private tileCount: number;
    private tileImage: string = "images/tile.png";
    private tiles: Array<Tile> = new Array();
    private foodPoints: Map<string, FoodPoint> = new Map();
    private thorns: Map<string, Thorn> = new Map();
    private objectsForRendering: Array<any> = new Array();

    private constructor()
    {
    }

    public static get Instance(): GameMap
    {
        if (this.instance)
        {
            return this.instance;
        }

        this.instance = new this();

        console.log("GameMap initialized.");
        return this.instance;
    }

    public get MapSize()
    {
        return this.mapSize;
    }

    public RemoveFoodPoints(removedFood: string[]): void
    {
        for (let i in removedFood)
        {
            this.foodPoints.delete(removedFood[i]);
        }
    }

    public RemoveThorns(removedThorns: string[]): void
    {
        for (let i in removedThorns)
        {
            this.thorns.delete(removedThorns[i]);
        }
    }

    private Clear(): void
    {
        this.foodPoints.clear();
        this.thorns.clear();
        this.tiles = [];
    }

    private GenerateTiles(): void
    {
        /* Создать плитки по оси X */
        for (let x = -1; x <= this.tileCount; x++) 
        {
            /* Создать плитки по оси Y */
            for (let y = -1; y <= this.tileCount; y++) 
            {
                // Если это край карты
                if (((y == -1 || y == this.tileCount) || (x == -1 || x == this.tileCount))) 
                {
                    // Добавить плитку края карты
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

                // Добавить основную плитку
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

    public AddNewFoodPoints(data: ServerDataSchemas.NewFoods): void
    {
        let foodsMap: Map<string, FoodToRender> = new Map(data.newFoods);
        
        foodsMap.forEach(food =>
        {   
            if (food.ownerId)
            {
                let owner: Player = PlayersManager.Instance.GetPlayer(food.ownerId);

                if (owner)
                {
                    let ownerPosition = owner.getPositionC();
                    food.x = ownerPosition.x;
                    food.y = ownerPosition.y;
                }
            }

            this.foodPoints.set(food.id, new FoodPoint(food));
        });
    }

    public AddNewThorns(data: ServerDataSchemas.NewThorns): void
    {
        let thornsMap: Map<string, any> = new Map(data.thorns);
        
        thornsMap.forEach(thorn =>
        {   
            this.thorns.set(thorn.id, new Thorn(thorn));
        });
    }

    public CreateMap(params): void
    {
        this.Clear();

        this.mapSize    = params.map_size;
        this.minMapEdge = params.map_min_edge;
        this.tileSize   = params.tile_size;
        this.tileCount  = params.tile_count;

        this.GenerateTiles();
        this.AddNewFoodPoints(params.foodPoints);
        this.AddNewThorns(params.thorns);
    }

    public DrawTiles(): void
    {
        this.tiles.forEach((tile) =>
        {
            if (tile.isInCamera())
                tile.draw(); 
        });
    }
    
    /** Находится ли игрок в пределах карты 
     * @param center Центральная точка игрока
     * @param pos Точка для перемещения
    */
    public CheckMapMapBorder(center: Vector2, pos: Vector2): boolean
    {
        return (center.x >= -this.minMapEdge 
            && center.x <= this.mapSize + this.minMapEdge
            && center.y >= -this.minMapEdge 
            && center.y <= this.mapSize + this.minMapEdge)
            || (pos.x >= -this.minMapEdge 
            && pos.x <= this.mapSize + this.minMapEdge 
            && pos.y >= -this.minMapEdge 
            && pos.y <= this.mapSize + this.minMapEdge);
    }

    public AddGameObjectToRender(gameObj: any): void
    {
        this.objectsForRendering.push(gameObj);
    }

    public ClearGameObjectsForRendering(): void
    {
        this.objectsForRendering = [];
    }

    public RenderGameObjects(): void
    {
        // Отсортировать объекты по значению радиуса
        this.objectsForRendering.sort((a, b) => a.radius - b.radius);

        for (let gameObj of this.objectsForRendering)
        {
            gameObj.draw();
            // gameObj.drawStaticBox();
            // gameObj.drawDynamicBox();

            if (gameObj.alpha < 1)
            {
                gameObj.transparent(0.1);
            }

            if (gameObj.nicknameLength)
            {
                gameObj.nickname.draw();
            }

            if (gameObj.ownerId && !gameObj.InPosition())
            {
                gameObj.MoveToTarget();
            }
        }
    }

    public CheckFoodPointsIntersect(localPlayerIsAlive: boolean, localPlayer: LocalPlayer): string[]
    {
        /** Id объектов еды, которую скушал игрок */
        let removedFoods: string[] = [];

        this.foodPoints.forEach(food =>
        {
            if (food.isInCamera())
            {
                // Если локальный игрок жив,
                // радиус не достиг максимума,
                // и пересекается с бъектом еды
                if (localPlayerIsAlive
                    && !localPlayer.IsRadiusPeaked() 
                    && localPlayer.isStaticIntersect(food)
                    && (food.GetOwnerId() != localPlayer.GetServerId() || food.InPosition())
                    && localPlayer.getDistanceC(food.getPositionC()) <= localPlayer.radius)
                {
                    removedFoods.push(food.GetServerID());
                }
                else
                {
                    this.AddGameObjectToRender(food);
                }
            }
        });

        this.RemoveFoodPoints(removedFoods);
        return removedFoods;
    }

    public CheckThornsIntersect(localPlayerIsAlive: boolean, localPlayer: LocalPlayer): string[]
    {
        /** Id объектов колючек, которую скушал игрок */
        let removedThorns: string[] = [];

        this.thorns.forEach(thorn =>
        {
            if (thorn.isInCamera())
            {
                // Если локальный игрок жив,
                // радиус не достиг максимума,
                // пересекается с бъектом колючки
                // и радиус игрока больше чем у колючки
                if (localPlayerIsAlive
                    && localPlayer.radius > thorn.radius
                    && !localPlayer.IsRadiusPeaked() 
                    && localPlayer.isStaticIntersect(thorn)
                    && localPlayer.getDistanceC(thorn.getPositionC()) <= localPlayer.radius)
                {
                    removedThorns.push(thorn.GetServerID());
                    return;
                }

                this.AddGameObjectToRender(thorn);
            }
        });

        this.RemoveThorns(removedThorns);
        return removedThorns;
    }
};