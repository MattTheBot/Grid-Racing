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
  
  // Create node material
  const nodeMaterial = new BABYLON.NodeMaterial("nodeMat");
  nodeMaterial.mode = BABYLON.NodeMaterialModes.Material;

  const position = new BABYLON.InputBlock("position");
  position.visibleInInspector = false;
  position.visibleOnFrame = false;
  position.target = 1;
  position.setAsAttribute("position");

  const WorldPos = new BABYLON.TransformBlock("WorldPos");
  WorldPos.visibleInInspector = false;
  WorldPos.visibleOnFrame = false;
  WorldPos.target = 1;
  WorldPos.complementZ = 0;
  WorldPos.complementW = 1;

  const World = new BABYLON.InputBlock("World");
  World.visibleInInspector = false;
  World.visibleOnFrame = false;
  World.target = 1;
  World.setAsSystemValue(BABYLON.NodeMaterialSystemValues.World);

  const WorldPosViewProjectionTransform = new BABYLON.TransformBlock("WorldPos * ViewProjectionTransform");
  WorldPosViewProjectionTransform.visibleInInspector = false;
  WorldPosViewProjectionTransform.visibleOnFrame = false;
  WorldPosViewProjectionTransform.target = 1;
  WorldPosViewProjectionTransform.complementZ = 0;
  WorldPosViewProjectionTransform.complementW = 1;

  const ViewProjection = new BABYLON.InputBlock("ViewProjection");
  ViewProjection.visibleInInspector = false;
  ViewProjection.visibleOnFrame = false;
  ViewProjection.target = 1;
  ViewProjection.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection);

  const VertexOutput = new BABYLON.VertexOutputBlock("VertexOutput");
  VertexOutput.visibleInInspector = false;
  VertexOutput.visibleOnFrame = false;
  VertexOutput.target = 1;

  const color = new BABYLON.InputBlock("color");
  color.visibleInInspector = true;
  color.visibleOnFrame = false;
  color.target = 1;
  color.value = new BABYLON.Color4(0.8, 0.8, 0.8, 1);
  color.isConstant = false;

  const FragmentOutput = new BABYLON.FragmentOutputBlock("FragmentOutput");
  FragmentOutput.visibleInInspector = false;
  FragmentOutput.visibleOnFrame = false;
  FragmentOutput.target = 2;
  FragmentOutput.convertToGammaSpace = false;
  FragmentOutput.convertToLinearSpace = false;
  FragmentOutput.useLogarithmicDepth = false;

  position.output.connectTo(WorldPos.vector);
  World.output.connectTo(WorldPos.transform);
  WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector);
  ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform);
  WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector);
  color.output.connectTo(FragmentOutput.rgba);

  nodeMaterial.addOutputNode(VertexOutput);
  nodeMaterial.addOutputNode(FragmentOutput);
  nodeMaterial.build();

  showError('Loading model...');
  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "trashcan.glb", scene, function(meshes) {
    showError('Model loaded: ' + meshes.length + ' meshes');
    if (meshes.length > 0) {
      const model = meshes[0];
      model.material = nodeMaterial;
      model.scaling = new BABYLON.Vector3(2, 2, 2);
      model.position = new BABYLON.Vector3(0, 0, 0);
    }
  }, function(progress) {
    // showError('Loading progress: ' + Math.round(progress.loaded / progress.total * 100) + '%');
  }, function(error) {
    showError('Model load FAILED: ' + (error.message || error.toString()));
    showError('Error details: code=' + (error.code || 'none') + ', name=' + (error.name || 'none'));
    // Create fallback box with StandardMaterial
    const box = BABYLON.MeshBuilder.CreateBox("box", {size: 3}, scene);
    
    // Create a better material for the box
    const boxMaterial = new BABYLON.StandardMaterial("fallbackMat", scene);
    boxMaterial.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
    boxMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    boxMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    boxMaterial.wireframe = false;
    box.material = boxMaterial;
    
    box.position = new BABYLON.Vector3(0, 0, 0);
    showError('Created fallback box');
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
