console.log("Starting initialization..");
import { Port, GameControl } from './@imports.js';
GameControl.Initialize(io(":" + Port));
GameControl.Instance.Start();
