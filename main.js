import { createSplashScene } from "./scenes/splashScene.js";
import { createGarageScene } from "./scenes/garageScene.js";
import { createRaceScene } from "./scenes/raceScene.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

let currentScene = createSplashScene(engine);

engine.runRenderLoop(() => {
    currentScene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});

// Scene switching helper
export function switchScene(newScene) {
    currentScene.dispose();
    currentScene = newScene;
}
