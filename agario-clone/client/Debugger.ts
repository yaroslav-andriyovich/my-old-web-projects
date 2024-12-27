import { System, Server } from './@imports.js';

export class Debugger
{
    private static instance: Debugger = null;
    
    private htmlElement = $("#fps");

    private constructor()
    {
    }

    public static get Instance(): Debugger
    {
        if (this.instance)
        {
            return this.instance;
        }

        this.instance = new this();
        setInterval(() => this.instance.Update(System.getFPS(), Server.Instance.Ping), 1000);

        console.log("Debugger initialized.");
        return this.instance;
    }

    private Update(fps: string, ping: string): void
    {
        this.htmlElement.html(`FPS: ${fps}. ${ping} sec.`);
    }
}