export function createGarageScene(engine) {
    const scene = new BABYLON.Scene(engine);

    // Basic camera
    const camera = new BABYLON.FreeCamera(
        "garageCam",
        new BABYLON.Vector3(0, 2, -8),
        scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(engine.getRenderingCanvas(), true);

    // Basic light
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    return scene;
}
