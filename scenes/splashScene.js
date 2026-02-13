import { switchScene } from "../main.js";
import { createGarageScene } from "./garageScene.js";

export function createSplashScene(engine) {
    const scene = new BABYLON.Scene(engine);

    // CAMERA
    const camera = new BABYLON.FreeCamera(
        "camera1",
        new BABYLON.Vector3(0, 5, -10),
        scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(engine.getRenderingCanvas(), true);

    // LIGHT
    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.7;

    // SPHERE
    const sphere = BABYLON.MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 2, segments: 32 },
        scene
    );
    sphere.position.y = 1;

    // GROUND
    BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: 6, height: 6 },
        scene
    );

    // GUI BUTTON → Go to Garage
    const ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const startBtn = BABYLON.GUI.Button.CreateSimpleButton("start", "Enter Garage");
    startBtn.width = "200px";
    startBtn.height = "60px";
    startBtn.color = "white";
    startBtn.background = "black";

    startBtn.onPointerUpObservable.add(() => {
        switchScene(createGarageScene(engine));
    });

    ui.addControl(startBtn);

    return scene;
}
