// Main entry point for Grid Racing game

function showError(msg) {
  const errDiv = document.getElementById('errorDisplay');
  if (errDiv) {
    errDiv.style.display = 'block';
    errDiv.innerHTML += msg + '<br/>';
  }
  console.error(msg);
}

window.onerror = function(msg, url, lineNo, colNo, error) {
  showError('ERROR: ' + msg);
  return true;
};

try {
  showError('Initializing...');
  
  const canvas = document.getElementById('renderCanvas');
  if (!canvas) {
    throw new Error('Canvas not found');
  }
  
  if (typeof BABYLON === 'undefined') {
    throw new Error('Babylon.js not loaded');
  }
  
  showError('Creating engine...');
  const engine = new BABYLON.Engine(canvas, true);
  
  // Create scene manually
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);
  
  showError('Setting up camera...');
  const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 2, -8));
  camera.attachControl(canvas, true);
  camera.angularSensibility = 1000; // Slower rotation
  camera.inertia = 0.7; // Smooth motion
  
  showError('Adding lights...');
  const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light1.intensity = 1.0;
  light1.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  
  const light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(5, 5, 5), scene);
  light2.intensity = 1.0;
  light2.range = 50;
  
  const light3 = new BABYLON.PointLight("light3", new BABYLON.Vector3(-5, 5, -5), scene);
  light3.intensity = 0.7;
  light3.range = 50;
  
  // Create simple color material instead of complex NodeMaterial
  const simpleMaterial = new BABYLON.StandardMaterial("simpleMat", scene);
  simpleMaterial.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
  simpleMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
  simpleMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  showError('Loading model...');
  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "scene.gltf", scene, function(meshes, particleSystems, skeletons, animationGroups) {
    showError('Model loaded: ' + meshes.length + ' meshes');
    
    // Filter out null/empty meshes
    const validMeshes = meshes.filter(m => m !== null && m !== undefined);
    
    if (validMeshes.length > 0) {
      validMeshes.forEach(mesh => {
        if (mesh.name) {
          showError('Mesh: ' + mesh.name);
        }
      });
      showError('Model ready!');
    } else {
      showError('WARNING: No valid meshes found');
    }
  }, function(progress) {
    if (progress.lengthComputable) {
      const percent = Math.round(progress.loaded / progress.total * 100);
      showError('Loading: ' + percent + '%');
    }
  }, function(error) {
    console.error('Model error:', error);
    showError('Model load FAILED - checking for missing files...');
    showError('Make sure scene.bin is in assets/models/ folder');
    showError('Creating fallback geometry instead');
    
    // Create fallback: larger box to act as background
    const box = BABYLON.MeshBuilder.CreateBox("box", {size: 20}, scene);
    const boxMaterial = new BABYLON.StandardMaterial("fallbackMat", scene);
    boxMaterial.diffuse = new BABYLON.Color3(0.3, 0.3, 0.4);
    boxMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    box.material = boxMaterial;
    box.position.z = 5;
    
    // Add a sphere for interest
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 3}, scene);
    const sphereMaterial = new BABYLON.StandardMaterial("sphereMat", scene);
    sphereMaterial.diffuse = new BABYLON.Color3(0.9, 0.6, 0.2);
    sphereMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    sphere.material = sphereMaterial;
    sphere.position = new BABYLON.Vector3(0, 1, 0);
    
    showError('Fallback scene created');
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });

  engine.runRenderLoop(() => {
    scene.render();
  });

  showError('Running! Meshes: ' + scene.meshes.length);
  
} catch (error) {
  showError('MAIN ERROR: ' + error.message);
  if (error.stack) showError(error.stack);
}
