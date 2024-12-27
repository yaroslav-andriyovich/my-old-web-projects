console.log("Starting initialization..");
import { Port, GameControl } from './@imports.js';
GameControl.Initialize(io(":" + Port));
GameControl.Instance.Start();

// TODO: Реализовать кормление шипа, и его увеличение
// TODO: Реализовать создание нового шипа когда шип, который кормили достиг максимального радиуса
// TODO: Реализовать деление игрока на несколько частей