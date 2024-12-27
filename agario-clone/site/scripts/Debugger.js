import { System, Server } from './@imports.js';
export class Debugger {
    constructor() {
        this.htmlElement = $("#fps");
    }
    static get Instance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new this();
        setInterval(() => this.instance.Update(System.getFPS(), Server.Instance.Ping), 1000);
        console.log("Debugger initialized.");
        return this.instance;
    }
    Update(fps, ping) {
        this.htmlElement.html(`FPS: ${fps}. ${ping} sec.`);
    }
}
Debugger.instance = null;
