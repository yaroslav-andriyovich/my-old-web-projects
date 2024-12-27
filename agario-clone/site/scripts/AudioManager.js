import { WAudio } from "./@imports.js";
var SoundsList;
(function (SoundsList) {
    SoundsList["Die"] = "sounds/vsos.wav";
    SoundsList["AteThorn"] = "sounds/ate_thorn.wav";
})(SoundsList || (SoundsList = {}));
;
export class AudioManager {
    constructor() {
        this.sounds = new Map();
    }
    static get Instance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new this();
        for (let i in SoundsList) {
            this.instance.sounds.set(SoundsList[i], new WAudio(SoundsList[i], 0.2));
        }
        console.log("AudioManager initialized.");
        return this.instance;
    }
    GetSound(id) {
        return this.sounds.get(id);
    }
    Die() {
        this.GetSound(SoundsList.Die).play();
    }
    AteThorn() {
        this.GetSound(SoundsList.AteThorn).play();
    }
}
AudioManager.instance = null;
;
