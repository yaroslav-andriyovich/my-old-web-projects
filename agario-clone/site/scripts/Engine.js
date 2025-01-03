import PointJS from './js_libs/PointJS.js';
const Engine = new PointJS(0, 0, { backgroundColor: "rgb(233, 233, 233)" });
export const System = Engine.system;
export const Game = Engine.game;
export const Camera = Engine.camera;
export const MouseControl = Engine.mouseControl;
export const GetMousePosition = MouseControl.getPosition;
export const KeyControl = Engine.keyControl;
export const Vector = Engine.vector;
export const VectorSize = Vector.size;
export const VectorPoint = Vector.point;
export const WAudio = Engine.wAudio.newAudio;
export const CircleObject = Game.newCircleObject;
export const ImageObject = Game.newImageObject;
export const TextObject = Game.newTextObject;
