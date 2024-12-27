import { ImageObject } from './@imports.js';

export class Tile extends ImageObject
{
    constructor(params: { file: string, w: number, h: number, x: number, y: number, alpha: number })
    {
        super(params);
    }
}