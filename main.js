// Show errors on screen since console is blocked
window.onerror = function (msg, url, line, col, error) {
    document.getElementById("debug").innerText =
        "ERROR: " + msg + " (line " + line + ")";
};

document.getElementById("debug").innerText = "main.js loaded";

import { createSplashScene } from "./scenes/splashScene.js";
import { createGarageScene } from "./scenes/garageScene.js";
import { createRaceScene } from "./scenes/raceScene.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

let currentScene = createSplashScene(engine);

engine.runRenderLoop(() => {
    document.getElementById("debug").innerText = "Rendering…";
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
