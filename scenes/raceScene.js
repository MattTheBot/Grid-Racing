export function createRaceScene(engine) {
    const scene = new BABYLON.Scene(engine);

    // Basic camera
    const camera = new BABYLON.FreeCamera(
        "raceCam",
        new BABYLON.Vector3(0, 5, -12),
        scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(engine.getRenderingCanvas(), true);

    // Basic light
    new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    return scene;
}
