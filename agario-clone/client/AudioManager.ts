import { WAudio } from "./@imports.js";

enum SoundsList 
{
    Die = "sounds/vsos.wav",
    AteThorn = "sounds/ate_thorn.wav"
};

export class AudioManager
{
    private static instance: AudioManager = null;

    private sounds: Map<string, any> = new Map();

    private constructor()
    {
    }

    public static get Instance(): AudioManager
    {
        if (this.instance)
        {
            return this.instance;
        }

        this.instance = new this();

        for (let i in SoundsList)
        {
            this.instance.sounds.set(SoundsList[i], new WAudio(SoundsList[i], 0.2));
        }

        console.log("AudioManager initialized.");
        return this.instance;
    }

    private GetSound(id: string): any
    {
        return this.sounds.get(id);
    }

    public Die(): void
    {
        this.GetSound(SoundsList.Die).play();
    }

    public AteThorn(): void
    {
        this.GetSound(SoundsList.AteThorn).play();
    }
};