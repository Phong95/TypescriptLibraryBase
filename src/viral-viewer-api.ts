import CameraControls from "camera-controls";
import { ViewerOptions } from "./types";
import { ViralViewerRevitLoader } from "./components/loader/viral-viewer-revit.loader";
import { CompressProcessor } from "./components/compress/compress.processor";
import { ViralViewerWorker } from "./components/worker/viral-viewer.worker";
import { ViralViewerPointCloudLoader } from "./components/loader/viral-viewer-point-cloud.loader";
import { ViralCamera } from "./components/camera/viral-camera";
import { ViralMouse } from "./components/mouse/viral-mouse";
import { ViralScene } from "./components/scene/viral-scene";
import { ViralRenderer } from "./components/renderer/viral-renderer";
import { ViralNavigationCube } from "./components/navigation-cube/viral-navigation-cube";
import { ViralAnimation } from "./components/animation/viral-animation";



export class ViralViewerApi {
    options: ViewerOptions;
    targetElement: HTMLElement;
    viralNavigationCube: ViralNavigationCube;
    viralScene: ViralScene;
    viralRenderer: ViralRenderer;
    viralCamera: ViralCamera;
    viralMouse: ViralMouse;
    viralAnimation:ViralAnimation;
    revitLoader: ViralViewerRevitLoader;
    pointCloudLoader: ViralViewerPointCloudLoader;
    compressProcessor: CompressProcessor = new CompressProcessor();
    worker: ViralViewerWorker | null = null;

    // cubeRenderer: WebGLRenderer | null = null;
    // cubeScene: Scene | null = null;
    // cubeCamera: PerspectiveCamera | null = null;
    // cubeCameraControls: CameraControls | null = null;


    public isUpdatingFromCube = false;
    public isUpdatingFromMain = false;
    constructor(options: ViewerOptions) {
        this.options = options;
        this.targetElement = options.container;
        this.viralNavigationCube = new ViralNavigationCube(this);
        this.viralScene = new ViralScene(this);
        this.viralRenderer = new ViralRenderer(this);
        this.viralCamera = new ViralCamera(this);
        this.viralMouse = new ViralMouse(this);
        this.viralAnimation = new ViralAnimation(this);
        this.revitLoader = new ViralViewerRevitLoader(this);
        this.pointCloudLoader = new ViralViewerPointCloudLoader(this);
        this.worker = new ViralViewerWorker(this);

    }
    public initial(scriptUrl?: string) {
        if (scriptUrl)
            this.worker = new ViralViewerWorker(this, scriptUrl);
    }

    // public injectCubeWrapperElement() {
    //     if (this.targetElement) {
    //         this.targetElement.innerHTML += `<div style="position: absolute;
    //         right: 10px;
    //         top: 10px;
    //         display: flex;">
    //                 <span class="material-symbols-outlined" style="color:white">
    //             home
    //             </span>
    //                 <div id="orientCubeWrapper" style="height:130px;width:130px"></div>
    //             </div>`
    //     }
    // }
    // public initialCubeWrapper() {
    //     const cubeWrapper = document.getElementById("orientCubeWrapper");
    //     if (cubeWrapper) {
    //         const width = cubeWrapper.offsetWidth;
    //         const height = cubeWrapper.offsetHeight;
    //         this.cubeScene = new Scene();
    //         this.cubeCamera = new PerspectiveCamera(60, width / height, 0.01, 100);
    //         this.cubeCamera.position.set(0, 0, 2);
    //         this.cubeRenderer = new WebGLRenderer({
    //             alpha: true,
    //             antialias: true,
    //             logarithmicDepthBuffer: true,
    //         });
    //         this.cubeRenderer.setClearColor(0x000000, 0);
    //         this.cubeRenderer.setSize(width, height);
    //         cubeWrapper.appendChild(this.cubeRenderer.domElement);
    //         this.cubeCameraControls = new CameraControls(this.cubeCamera, this.cubeRenderer.domElement);
    //         this.cubeCameraControls.dollyToCursor = false;
    //         this.cubeCameraControls.infinityDolly = false;
    //         this.cubeCameraControls.setTarget(0, 0, 0);
    //         this.cubeCameraControls.polarRotateSpeed = 0.15;
    //         this.cubeCameraControls.azimuthRotateSpeed = 0.15;
    //         this.cubeCameraControls.mouseButtons.middle = CameraControls.ACTION.NONE;
    //         this.cubeCameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;
    //         //#region Cube
    //         let materials = [];
    //         let texts = ["RIGHT", "LEFT", "TOP", "BOTTOM", "FRONT", "BACK"];

    //         let textureLoader = new TextureLoader();
    //         let canvas = document.createElement("canvas");
    //         let ctx = canvas.getContext("2d");

    //         let size = 64;
    //         canvas.width = size;
    //         canvas.height = size;
    //         if (ctx) {
    //             ctx.font = 'bolder 12px "Open sans", Arial';
    //             ctx.textBaseline = "middle";
    //             ctx.textAlign = "center";

    //             let mainColor = "#fff";
    //             let otherColor = "#ccc";

    //             let bg = ctx.createLinearGradient(0, 0, 0, size);
    //             bg.addColorStop(0, mainColor);
    //             bg.addColorStop(1, otherColor);

    //             for (let i = 0; i < 6; i++) {
    //                 if (texts[i] == "TOP") {
    //                     ctx.fillStyle = mainColor;
    //                 } else if (texts[i] == "BOTTOM") {
    //                     ctx.fillStyle = otherColor;
    //                 } else {
    //                     ctx.fillStyle = bg;
    //                 }
    //                 ctx.fillRect(0, 0, size, size);
    //                 ctx.strokeStyle = "#aaa";
    //                 ctx.setLineDash([8, 8]);
    //                 ctx.lineWidth = 4;
    //                 ctx.strokeRect(0, 0, size, size);
    //                 ctx.fillStyle = "#999";
    //                 ctx.fillText(texts[i], size / 2, size / 2);
    //                 materials[i] = new MeshBasicMaterial({
    //                     map: textureLoader.load(canvas.toDataURL()),
    //                 });
    //             }
    //         }

    //         let cube = new Mesh(new BoxGeometry(1, 1, 1), materials);
    //         this.cubeScene.add(cube);
    //         //#endregion

    //         //#region Planes
    //         let planes: any[] = [];

    //         let planeMaterial = new MeshBasicMaterial({
    //             side: DoubleSide,
    //             color: 0x00c0ff,
    //             transparent: true,
    //             opacity: 0,
    //             depthTest: false,
    //         });
    //         let planeSize = 0.7;
    //         let planeGeometry = new PlaneGeometry(planeSize, planeSize);

    //         let a = 0.51;

    //         let plane1 = new Mesh(planeGeometry, planeMaterial.clone());
    //         plane1.position.z = a;
    //         this.cubeScene.add(plane1);
    //         planes.push(plane1);

    //         let plane2 = new Mesh(planeGeometry, planeMaterial.clone());
    //         plane2.position.z = -a;
    //         this.cubeScene.add(plane2);
    //         planes.push(plane2);

    //         let plane3 = new Mesh(planeGeometry, planeMaterial.clone());
    //         plane3.rotation.y = Math.PI / 2;
    //         plane3.position.x = a;
    //         this.cubeScene.add(plane3);
    //         planes.push(plane3);

    //         let plane4 = new Mesh(planeGeometry, planeMaterial.clone());
    //         plane4.rotation.y = Math.PI / 2;
    //         plane4.position.x = -a;
    //         this.cubeScene.add(plane4);
    //         planes.push(plane4);

    //         let plane5 = new Mesh(planeGeometry, planeMaterial.clone());
    //         plane5.rotation.x = Math.PI / 2;
    //         plane5.position.y = a;
    //         this.cubeScene.add(plane5);
    //         planes.push(plane5);

    //         let plane6 = new Mesh(planeGeometry, planeMaterial.clone());
    //         plane6.rotation.x = Math.PI / 2;
    //         plane6.position.y = -a;
    //         this.cubeScene.add(plane6);
    //         planes.push(plane6);
    //         //#endregion

    //         //#region Event Handler
    //         let activePlane: any = null;
    //         let hasMoved = false;

    //         this.cubeRenderer.domElement.onmousemove = (evt) => {
    //             if (this.cubeRenderer && this.cubeScene && this.cubeCamera) {
    //                 this.isUpdatingFromMain = false;
    //                 this.isUpdatingFromCube = true;
    //                 if (activePlane) {
    //                     activePlane.material.opacity = 0;
    //                     activePlane.material.needsUpdate = true;
    //                     activePlane = null;
    //                     this.cubeRenderer.render(this.cubeScene, this.cubeCamera);
    //                 }

    //                 let x = evt.offsetX;
    //                 let y = evt.offsetY;
    //                 let size = this.cubeRenderer.getSize(new Vector2());
    //                 let mouse = new Vector2(
    //                     (x / size.width) * 2 - 1,
    //                     (-y / size.height) * 2 + 1
    //                 );

    //                 let raycaster = new Raycaster();
    //                 raycaster.setFromCamera(mouse, this.cubeCamera);
    //                 let intersects = raycaster.intersectObjects(planes.concat(cube));

    //                 if (intersects.length > 0 && intersects[0].object != cube) {
    //                     activePlane = intersects[0].object;
    //                     activePlane.material.opacity = 0.2;
    //                     activePlane.material.needsUpdate = true;
    //                     this.cubeRenderer.render(this.cubeScene, this.cubeCamera);
    //                 }
    //             }

    //         };


    //         // let startTime = 0;
    //         // let duration = 500;
    //         let oldPosition = new Vector3();
    //         let newPosition = new Vector3();
    //         // let play = false;

    //         this.cubeRenderer.domElement.onclick = (evt) => {
    //             if (this.cubeRenderer && this.cubeRenderer.domElement && this.cubeScene && this.cubeCamera && this.cubeCameraControls) {
    //                 // this.cubeRenderer.domElement.onmousemove(evt);

    //                 if (!activePlane || hasMoved) {
    //                     return false;
    //                 }

    //                 oldPosition.copy(this.cubeCamera.position);
    //                 let currentPoint = new Vector3();
    //                 this.cubeCameraControls.getTarget(currentPoint);
    //                 let distance = this.cubeCamera.position
    //                     .clone()
    //                     .sub(new Vector3(0, 0, 0))
    //                     .length();
    //                 // newPosition.copy(this.cubeCameraControls.getPosition());

    //                 if (activePlane.position.x !== 0) {
    //                     newPosition.x += activePlane.position.x < 0 ? -distance : distance;
    //                 } else if (activePlane.position.y !== 0) {
    //                     newPosition.y += activePlane.position.y < 0 ? -distance : distance;
    //                 } else if (activePlane.position.z !== 0) {
    //                     newPosition.z += activePlane.position.z < 0 ? -distance : distance;
    //                 }
    //                 this.cubeCameraControls.setPosition(
    //                     (activePlane.position.x / 0.51) * 2,
    //                     (activePlane.position.y / 0.51) * 2,
    //                     (activePlane.position.z / 0.51) * 2,
    //                 );
    //             }

    //         };
    //         //#endregion
    //     }

    // }
    // private updateCube() {
    //     if (this.cubeCamera && this.viralCamera && this.viralCamera.camera && this.viralCamera.cameraControls && this.cubeCameraControls) {
    //         this.cubeCamera.rotation.copy(this.viralCamera.camera.rotation);
    //         let mainCameraTarget = new Vector3();
    //         this.viralCamera.cameraControls.getTarget(mainCameraTarget);
    //         let dir = this.viralCamera.camera.position
    //             .clone()
    //             .sub(mainCameraTarget)
    //             .normalize();
    //         this.cubeCamera.position.copy(dir.multiplyScalar(2));
    //         this.cubeCameraControls.setPosition(
    //             this.cubeCamera.position.x,
    //             this.cubeCamera.position.y,
    //             this.cubeCamera.position.z
    //         );
    //     }

    //     // this.cubeRenderer.render(this.cubeScene, this.cubeCamera);
    // }
    // private updateMain() {
    //     if (this.cubeCamera && this.viralCamera && this.viralCamera.camera && this.viralCamera.cameraControls && this.cubeCameraControls && this.renderer && this.scene) {
    //         this.viralCamera.camera.rotation.copy(this.cubeCamera.rotation);
    //         let cubeCameraTarget = new Vector3();
    //         this.cubeCameraControls.getTarget(cubeCameraTarget);
    //         let dir = this.viralCamera.camera.position
    //             .clone()
    //             .sub(cubeCameraTarget)
    //             .normalize();
    //         let length = this.viralCamera.camera.position.distanceTo(cubeCameraTarget);
    //         this.viralCamera.camera.position.copy(dir.multiplyScalar(length));
    //         if (this.viralCamera.cameraControls) {
    //             this.viralCamera.cameraControls.setPosition(
    //                 this.viralCamera.camera.position.x,
    //                 this.viralCamera.camera.position.y,
    //                 this.viralCamera.camera.position.z
    //             );
    //         }

    //         this.renderer.render(this.scene, this.viralCamera.camera);
    //     }

    // }

}