// Main entry point for Grid Racing game
import { createSplashScene } from './scenes/splashScene.js';

try {
  const canvas = document.getElementById('renderCanvas');
  if (!canvas) {
    throw new Error('Canvas element not found!');
  }
  
  console.log('Canvas found:', canvas);
  console.log('BABYLON:', typeof BABYLON);
  
  const engine = new BABYLON.Engine(canvas, true);
  console.log('Engine created');
  
  // Create and display splash scene
  const splashScene = createSplashScene(engine, canvas);
  console.log('Splash scene created');
  
  // Resize handler
  window.addEventListener('resize', () => {
    engine.resize();
  });
  
  // Main game loop
  engine.runRenderLoop(() => {
    splashScene.render();
  });
  
  console.log('Grid Racing initialized - Render loop started');
} catch (error) {
  console.error('Error initializing Grid Racing:', error);
  console.error('Stack:', error.stack);
}
