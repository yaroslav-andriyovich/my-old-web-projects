import PointJS from './js_libs/PointJS.js';

/** Движок PointJS */
const Engine: PointJS = new PointJS(0, 0, { backgroundColor: "rgb(233, 233, 233)" });

/** Объект движка для управления системными настройками */
export const System = Engine.system;

/** Объект движка для управления игровыми настройками */
export const Game = Engine.game;

/** Объект камеры в движке */
export const Camera = Engine.camera;

/** Объект движка для взаимодействия с мышкой */
export const MouseControl = Engine.mouseControl;

/** Метод для получения координат курсора мышки */
export const GetMousePosition = MouseControl.getPosition;

/** Объект движка для взаимодействия с клавиатурой */
export const KeyControl = Engine.keyControl;

/** Объект движка Vector */
export const Vector = Engine.vector;

/** Объект движка Size */
export const VectorSize = Vector.size;

/** Метод движка для создания точки в 2D пространстве */
export const VectorPoint = Vector.point;    

/** Метод движка для создания аудио объекта */
export const WAudio = Engine.wAudio.newAudio;

/** Метод движка для создания Circle объекта */
export const CircleObject = Game.newCircleObject;

/** Метод движка для создания Image объекта */
export const ImageObject = Game.newImageObject;

/** Метод движка для создания Text объекта */
export const TextObject = Game.newTextObject;