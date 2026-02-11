// Splash Scene - 3D Background with Node Material

export function createSplashScene(engine, canvas) {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);
  scene.collisionsEnabled = true;
  
  // Setup camera with better positioning
  const camera = new BABYLON.UniversalCamera("splashCamera", new BABYLON.Vector3(0, 2, -8));
  camera.attachControl(canvas, true);
  camera.inertia = 0.7;
  camera.angularSensibility = 1000;
  camera.minZ = 0.1;
  camera.maxZ = 1000;
  
  // Improve lighting
  const light1 = new BABYLON.HemisphericLight("splashLight1", new BABYLON.Vector3(0, 1, 0), scene);
  light1.intensity = 1.2;
  light1.specular = new BABYLON.Color3(1, 1, 1);
  
  const light2 = new BABYLON.PointLight("splashLight2", new BABYLON.Vector3(5, 5, 5), scene);
  light2.intensity = 0.8;

  // Create Node Material for background model
  const nodeMaterial = new BABYLON.NodeMaterial("nodeMat");
  nodeMaterial.mode = BABYLON.NodeMaterialModes.Material;

  // InputBlock - position
  const position = new BABYLON.InputBlock("position");
  position.visibleInInspector = false;
  position.visibleOnFrame = false;
  position.target = 1;
  position.setAsAttribute("position");

  // TransformBlock - World position
  const WorldPos = new BABYLON.TransformBlock("WorldPos");
  WorldPos.visibleInInspector = false;
  WorldPos.visibleOnFrame = false;
  WorldPos.target = 1;
  WorldPos.complementZ = 0;
  WorldPos.complementW = 1;

  // InputBlock - World matrix
  const World = new BABYLON.InputBlock("World");
  World.visibleInInspector = false;
  World.visibleOnFrame = false;
  World.target = 1;
  World.setAsSystemValue(BABYLON.NodeMaterialSystemValues.World);

  // TransformBlock - Final position transformation
  const WorldPosViewProjectionTransform = new BABYLON.TransformBlock("WorldPos * ViewProjectionTransform");
  WorldPosViewProjectionTransform.visibleInInspector = false;
  WorldPosViewProjectionTransform.visibleOnFrame = false;
  WorldPosViewProjectionTransform.target = 1;
  WorldPosViewProjectionTransform.complementZ = 0;
  WorldPosViewProjectionTransform.complementW = 1;

  // InputBlock - ViewProjection matrix
  const ViewProjection = new BABYLON.InputBlock("ViewProjection");
  ViewProjection.visibleInInspector = false;
  ViewProjection.visibleOnFrame = false;
  ViewProjection.target = 1;
  ViewProjection.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection);

  // VertexOutputBlock
  const VertexOutput = new BABYLON.VertexOutputBlock("VertexOutput");
  VertexOutput.visibleInInspector = false;
  VertexOutput.visibleOnFrame = false;
  VertexOutput.target = 1;

  // InputBlock - Color (light gray)
  const color = new BABYLON.InputBlock("color");
  color.visibleInInspector = true; // Make adjustable
  color.visibleOnFrame = false;
  color.target = 1;
  color.value = new BABYLON.Color4(0.8, 0.8, 0.8, 1);
  color.isConstant = false;

  // FragmentOutputBlock
  const FragmentOutput = new BABYLON.FragmentOutputBlock("FragmentOutput");
  FragmentOutput.visibleInInspector = false;
  FragmentOutput.visibleOnFrame = false;
  FragmentOutput.target = 2;
  FragmentOutput.convertToGammaSpace = false;
  FragmentOutput.convertToLinearSpace = false;
  FragmentOutput.useLogarithmicDepth = false;

  // Connect the blocks
  position.output.connectTo(WorldPos.vector);
  World.output.connectTo(WorldPos.transform);
  WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector);
  ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform);
  WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector);
  color.output.connectTo(FragmentOutput.rgba);

  // Add output nodes and build material
  nodeMaterial.addOutputNode(VertexOutput);
  nodeMaterial.addOutputNode(FragmentOutput);
  nodeMaterial.build();

  // Load background model (adjust path based on your actual model location)
  BABYLON.SceneLoader.ImportMesh("", "assets/models/", "trashcan.glb", scene, function(meshes) {
    if (meshes.length > 0) {
      const backgroundModel = meshes[0];
      backgroundModel.material = nodeMaterial;
      
      // Scale and position the model as needed
      backgroundModel.scaling = new BABYLON.Vector3(10, 10, 10);
      backgroundModel.position = new BABYLON.Vector3(0, 0, 0);
    }
  }, null, function(error) {
    console.error("Failed to load model:", error);
    // Create a fallback box if model fails
    const fallbackBox = BABYLON.MeshBuilder.CreateBox("fallbackBox", {size: 5}, scene);
    fallbackBox.material = nodeMaterial;
    fallbackBox.position = new BABYLON.Vector3(0, 0, 0);
  });

  return scene;
}

// Optional: disposer function
export function disposeSplashScene(scene) {
  scene.dispose();
}
