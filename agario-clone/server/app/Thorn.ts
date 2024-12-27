import { ServerDataSchemas } from 'client_server';

export class Thorn
{
    private radius: number;

    public readonly id: string;
    public readonly x: number;
    public readonly y: number;

    constructor(id: string, x: number, y: number, radius: number)
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    public get Id(): string
    {
        return this.id;
    }

    public get Radius(): number
    {
        return this.radius;
    }

    public set Radius(value: number)
    {
        this.radius = value;
    }

    public get ToRender(): ServerDataSchemas.ThornToRender
    {
        return new ServerDataSchemas.ThornToRender
        (
        this.id,
        this.x, 
        this.y,
        this.radius
        );
    }
}