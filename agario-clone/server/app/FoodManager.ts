import { Player, Config, Food, Utils } from 'server';
import { DataTypes, ServerDataSchemas } from 'client_server';

export class FoodManager
{
    private static instance: FoodManager = null;
    private foodMap: Map<string, Food> = new Map();

    constructor()
    {
        if (FoodManager.instance)
        {
            return FoodManager.instance;
        }

        FoodManager.instance = this;
        
        this.GenerateNewFood();
    }

    public get ListToSend(): ServerDataSchemas.NewFoods
    {
        let newFoodMap: Map<string, ServerDataSchemas.FoodToRender> = new Map();

        this.foodMap.forEach((food) =>
        {
            newFoodMap.set(food.Id, food.ToRender);
        });

        return new ServerDataSchemas.NewFoods(Array.from(newFoodMap));
    }

    public get AmountFood(): number
    {
        return this.foodMap.size;
    }

    public get CanGenerateFood(): boolean
    {
        return this.AmountFood < Config.max_foods_count;
    }

    public GetFood(id: string): Food
    {
        return this.foodMap.get(id);
    }

    public Remove(removedFood: Array<string>): number
    {
        let removedCount = 0;

        for (let i in removedFood)
        {
            if (!this.GetFood(removedFood[i]))
            {
                continue;
            }

            this.foodMap.delete(removedFood[i]);
            removedCount++;
        }

        return removedCount;
    }

    public GenerateNewFood(): Array<[string, ServerDataSchemas.FoodToRender]>
    {
        let amountNewFood = Config.max_foods_count - this.AmountFood;
        let newFoodMap: Map<string, ServerDataSchemas.FoodToRender> = new Map();

        for (let i = 0; i < amountNewFood; i++) 
        {
            let newFood = new Food(
                new DataTypes.Vector2(Utils.RandomSpawnPoint(), Utils.RandomSpawnPoint()),
                Utils.Random(Config.min_food_radius, Config.max_food_radius),
                Utils.GetRGB(Utils.RandomColor())
            );

            this.foodMap.set(newFood.Id, newFood);
            newFoodMap.set(newFood.Id, newFood.ToRender);
        }

        return Array.from(newFoodMap);
    }

    public GeneratePlayerFood(owner: Player, mousePosition: DataTypes.Vector2): Array<[string, ServerDataSchemas.FoodToRender]>
    {
        let count = 1;
        let newFoods: Map<string, ServerDataSchemas.FoodToRender> = new Map();

        for (let i = 0; i < count; i++) 
        {
            let newFood = new Food(
                owner.Position,
                Config.ediblePlayerPart_radius,
                owner.FillColor,
                owner.Id,
                owner.Position.Sum(mousePosition.Sub(owner.Position).Normalized.MultNum(owner.Radius + Config.ediblePlayerPart_maxDistance))
            );

            this.foodMap.set(newFood.Id, newFood);
            newFoods.set(newFood.Id, newFood.ToRender);
        }

        return Array.from(newFoods);
    }
}