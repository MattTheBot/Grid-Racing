// Main entry point for Grid Racing game
import { createSplashScene } from './scenes/splashScene.js';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

// Create and display splash scene
const splashScene = createSplashScene(engine, canvas);

// Resize handler
window.addEventListener('resize', () => {
  engine.resize();
});

// Main game loop
engine.runRenderLoop(() => {
  splashScene.render();
});

console.log('Grid Racing initialized');
