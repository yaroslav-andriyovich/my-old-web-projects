export const defaultNumber = 0;
export const defaultString = "";
export const defaultBool = false;

/** Проверить соответствие свойств, и их типа данных.
 * Используется для проверки входных данных от клиента. */
export function DataValidation(toCompare: Object, toCheck: Object) : boolean
{
    if (!toCompare || typeof toCompare !== "object" 
        || !toCheck|| typeof toCheck !== "object")
    {
        console.debug("toCompare:");
        console.dir(toCheck);
        console.debug("Is not object:");
        console.dir(toCompare);
        return false;
    }
    
    for (const [key, value] of Object.entries(toCompare))
    {
        if (value && typeof value !== "boolean" && typeof value === "object")
        {   
            if (DataValidation(value, toCheck[key]))
            {
                continue;
            }

            console.debug("toCompare:");
            console.dir(value);
            console.debug("ObjectTypeError:");
            console.dir(toCheck[key]);
            return false;
        }

        if (typeof toCompare[key] !== typeof toCheck[key])
        {
            console.debug("toCompare:");
            console.dir(toCompare[key]);
            console.debug("TypeError:");
            console.dir(toCheck[key]);
            return false;
        }
    }
    
    return true;
}

export class Vector2
{
    public readonly x: number;
    public readonly y: number;

    constructor (x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    public Sum(secondVector: Vector2): Vector2
    {
        return new Vector2(this.x + secondVector.x, this.y + secondVector.y);
    }

    public SumNum(num: number): Vector2
    {
        return new Vector2(this.x + num, this.y + num);
    }

    public Sub(secondVector: Vector2): Vector2
    {
        return new Vector2(this.x - secondVector.x, this.y - secondVector.y);
    }
    
    public SubNum(num: number): Vector2
    {
        return new Vector2(this.x - num, this.y - num);
    }

    public Mult(secondVector: Vector2): Vector2
    {
        return new Vector2(this.x * secondVector.x, this.y * secondVector.y);
    }
    
    public MultNum(num: number): Vector2
    {
        return new Vector2(this.x * num, this.y * num);
    }

    public Div(secondVector: Vector2): Vector2
    {
        return new Vector2(this.x / secondVector.x, this.y / secondVector.y);
    }

    public DivNum(num: number): Vector2
    {
        return new Vector2(this.x / num, this.y / num);
    }
    
    public get Magnitude(): number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public get Normalized(): Vector2
    {
        let value = this.DivNum(this.Magnitude);
        return new Vector2(value.x, value.y);
    }

    public get NormalizedRound(): Vector2
    {
        let value = this.DivNum(this.Magnitude);
        return new Vector2(Math.round(value.x), Math.round(value.y));
    }
}