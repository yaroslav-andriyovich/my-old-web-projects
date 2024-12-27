export const defaultNumber = 0;
export const defaultString = "";
export const defaultBool = false;
export function DataValidation(toCompare, toCheck) {
    if (!toCompare || typeof toCompare !== "object"
        || !toCheck || typeof toCheck !== "object") {
        console.debug("toCompare:");
        console.dir(toCheck);
        console.debug("Is not object:");
        console.dir(toCompare);
        return false;
    }
    for (const [key, value] of Object.entries(toCompare)) {
        if (value && typeof value !== "boolean" && typeof value === "object") {
            if (DataValidation(value, toCheck[key])) {
                continue;
            }
            console.debug("toCompare:");
            console.dir(value);
            console.debug("ObjectTypeError:");
            console.dir(toCheck[key]);
            return false;
        }
        if (typeof toCompare[key] !== typeof toCheck[key]) {
            console.debug("toCompare:");
            console.dir(toCompare[key]);
            console.debug("TypeError:");
            console.dir(toCheck[key]);
            return false;
        }
    }
    return true;
}
export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    Sum(secondVector) {
        return new Vector2(this.x + secondVector.x, this.y + secondVector.y);
    }
    SumNum(num) {
        return new Vector2(this.x + num, this.y + num);
    }
    Sub(secondVector) {
        return new Vector2(this.x - secondVector.x, this.y - secondVector.y);
    }
    SubNum(num) {
        return new Vector2(this.x - num, this.y - num);
    }
    Mult(secondVector) {
        return new Vector2(this.x * secondVector.x, this.y * secondVector.y);
    }
    MultNum(num) {
        return new Vector2(this.x * num, this.y * num);
    }
    Div(secondVector) {
        return new Vector2(this.x / secondVector.x, this.y / secondVector.y);
    }
    DivNum(num) {
        return new Vector2(this.x / num, this.y / num);
    }
    get Magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    get Normalized() {
        let value = this.DivNum(this.Magnitude);
        return new Vector2(value.x, value.y);
    }
    get NormalizedRound() {
        let value = this.DivNum(this.Magnitude);
        return new Vector2(Math.round(value.x), Math.round(value.y));
    }
}
