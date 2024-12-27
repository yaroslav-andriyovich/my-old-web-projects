import { ImageObject, VectorSize } from './Engine.js';
export class Thorn extends ImageObject {
    constructor(params) {
        super(Object.assign(Object.assign({}, params), { file: "images/thorn.png" }));
        this.GetServerID = () => {
            return this.serverId;
        };
        this.radius = params.radius - 10;
        this.serverId = params.id;
        var size = params.radius * 2;
        this.resize(VectorSize(size, size));
    }
}
