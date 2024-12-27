import { ImageObject, VectorSize } from './Engine.js';
import { ServerDataSchemas } from './client_server/index.js';

export class Thorn extends ImageObject
{
    private serverId: string;

    constructor (params: ServerDataSchemas.ThornToRender)
    {
        super({...params, file: "images/thorn.png"});

        this.radius = params.radius - 10;
        this.serverId = params.id;
        
        var size: number = params.radius * 2;
        this.resize(VectorSize(size, size));
    }

    public readonly GetServerID = () =>
    {
        return this.serverId;
    }
}