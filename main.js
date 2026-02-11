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
  
  // Add diagnostics display
  const debugDiv = document.createElement('div');
  debugDiv.style.position = 'absolute';
  debugDiv.style.top = '10px';
  debugDiv.style.left = '10px';
  debugDiv.style.color = '#fff';
  debugDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
  debugDiv.style.padding = '10px';
  debugDiv.style.fontFamily = 'monospace';
  debugDiv.style.fontSize = '12px';
  debugDiv.style.zIndex = '1000';
  debugDiv.innerHTML = `
    Canvas: ${canvas.width}x${canvas.height}<br/>
    Scene meshes: ${splashScene.meshes.length}<br/>
    Engine FPS: <span id="fps">-</span>
  `;
  document.body.appendChild(debugDiv);
  
  // Update FPS
  setInterval(() => {
    const fpsSpan = document.getElementById('fps');
    if (fpsSpan) fpsSpan.textContent = engine.getFps().toFixed(0);
  }, 500);
  
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
  
  // Display error on page
  const errorDiv = document.createElement('div');
  errorDiv.style.color = '#ff0000';
  errorDiv.style.padding = '20px';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.innerHTML = `ERROR: ${error.message}`;
  document.body.appendChild(errorDiv);
}
