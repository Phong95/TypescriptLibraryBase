import CameraControls from "camera-controls";
import { ViewerOptions } from "./types";
import * as THREE from "three";
import { ViralViewerRevitLoader } from "./components/loader/viral-viewer-revit.loader";
import { CompressProcessor } from "./components/compress/compress.processor";
import { ViralViewerWorker } from "./components/worker/viral-viewer.worker";
import { ViralViewerPointCloudLoader } from "./components/loader/viral-viewer-point-cloud.loader";
CameraControls.install({ THREE: THREE });

export class ViralViewerApi {
    options: ViewerOptions;

    targetElement: HTMLElement;
    scene: THREE.Scene;
    clock: THREE.Clock;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    cameraControls: CameraControls;
    revitLoader: ViralViewerRevitLoader;
    pointCloudLoader: ViralViewerPointCloudLoader;
    compressProcessor: CompressProcessor;
    worker: ViralViewerWorker;

    cubeRenderer: THREE.WebGLRenderer;
    cubeScene: THREE.Scene;
    cubeCamera: THREE.PerspectiveCamera;
    cubeCameraControls: CameraControls;


    public isUpdatingFromCube = false;
    public isUpdatingFromMain = false;
    constructor(options: ViewerOptions) {
        this.options = options;
        this.targetElement = options.container;
    }
    public initial(scriptUrl?: string) {
        if (this.targetElement) {
            // this.injectCubeWrapperElement();
            // this.initialCubeWrapper();
            this.setupScene();
            this.setupClock();
            this.setupRenderer();
            this.setupCamera();
            this.setupLights();
            this.rerender();
            this.revitLoader = new ViralViewerRevitLoader(this.scene);
            this.pointCloudLoader = new ViralViewerPointCloudLoader(this);
            this.compressProcessor = new CompressProcessor();
            if (scriptUrl)
                this.worker = new ViralViewerWorker(this, scriptUrl);
        }
    }
    public setupScene() {
        this.scene = new THREE.Scene();
    }
    public setupClock() {
        this.clock = new THREE.Clock();
    }
    public setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer: true,
            powerPreference: "high-performance",
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(this.targetElement.offsetWidth, this.targetElement.offsetHeight);
        this.targetElement.appendChild(this.renderer.domElement);
        // this.renderer.domElement.onmousemove = (evt) => {
        //     this.isUpdatingFromCube = false;
        //     this.isUpdatingFromMain = true;
        // };
    }
    public setupCamera() {
        this.camera = new THREE.PerspectiveCamera(60, this.targetElement.offsetWidth / this.targetElement.offsetHeight, 0.01, 2000000);
        this.camera.position.set(0, 0, 2);
        if (this.options && this.options.cameraZUp) {
            this.camera.up.set(0, 0, 1);
            this.camera.position.set(100, 100, 0);
        }
        this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);
        // this.cameraControls.dollyToCursor = true;
        this.cameraControls.infinityDolly = true;
        this.cameraControls.setTarget(0, 0, 0);
        this.cameraControls.mouseButtons.middle = CameraControls.ACTION.OFFSET;
        // this.anim();
    }
    public rerender() {
        this.renderer.render(this.scene, this.camera);

    }
    public anim() {
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();
        const updated = this.cameraControls?.update(delta);
        if (this.pointCloudLoader.potree) {
            this.pointCloudLoader.potree.updatePointClouds(this.pointCloudLoader.pointClouds, this.camera, this.renderer);

        }
        // const updated2 = this.cubeCameraControls?.update(delta);
        // if ( elapsed > 30 ) { return; }

        requestAnimationFrame(() => { this.anim() });

        if (updated) {
            this.renderer.render(this.scene, this.camera);
            // if (!this.isUpdatingFromCube) this.updateCube();

        }
        // if (updated2) {
        //     this.cubeRenderer.render(this.cubeScene, this.cubeCamera);
        //     if (!this.isUpdatingFromMain) this.updateMain();

        // }
    }

    public setupLights() {
        const light1 = new THREE.DirectionalLight(0xffeeff, 0.8);
        light1.position.set(1, 1, 1).normalize();
        this.scene.add(light1);
        const light2 = new THREE.DirectionalLight(0xffffff, 0.8);
        light2.position.set(-1, 0.5, -1).normalize();
        this.scene.add(light2);
        const ambientLight = new THREE.AmbientLight(0xffffee, 0.25);
        ambientLight.position.set(0, 0, 0).normalize();
        this.scene.add(ambientLight);
    }

    public addCube() {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true })
        );
        this.scene.add(mesh);
    }
    public addAxes() {
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    public injectCubeWrapperElement() {
        if (this.targetElement) {
            this.targetElement.innerHTML += `<div style="position: absolute;
            right: 10px;
            top: 10px;
            display: flex;">
                    <span class="material-symbols-outlined" style="color:white">
                home
                </span>
                    <div id="orientCubeWrapper" style="height:130px;width:130px"></div>
                </div>`
        }
    }
    public initialCubeWrapper() {
        const cubeWrapper = document.getElementById("orientCubeWrapper");
        const width = cubeWrapper.offsetWidth;
        const height = cubeWrapper.offsetHeight;
        this.cubeScene = new THREE.Scene();
        this.cubeCamera = new THREE.PerspectiveCamera(60, width / height, 0.01, 100);
        this.cubeCamera.position.set(0, 0, 2);
        this.cubeRenderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer: true,
        });
        this.cubeRenderer.setClearColor(0x000000, 0);
        this.cubeRenderer.setSize(width, height);
        cubeWrapper.appendChild(this.cubeRenderer.domElement);
        this.cubeCameraControls = new CameraControls(this.cubeCamera, this.cubeRenderer.domElement);
        this.cubeCameraControls.dollyToCursor = false;
        this.cubeCameraControls.infinityDolly = false;
        this.cubeCameraControls.setTarget(0, 0, 0);
        this.cubeCameraControls.polarRotateSpeed = 0.15;
        this.cubeCameraControls.azimuthRotateSpeed = 0.15;
        this.cubeCameraControls.mouseButtons.middle = CameraControls.ACTION.NONE;
        this.cubeCameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;
        //#region Cube
        let materials = [];
        let texts = ["RIGHT", "LEFT", "TOP", "BOTTOM", "FRONT", "BACK"];

        let textureLoader = new THREE.TextureLoader();
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let size = 64;
        canvas.width = size;
        canvas.height = size;

        ctx.font = 'bolder 12px "Open sans", Arial';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        let mainColor = "#fff";
        let otherColor = "#ccc";

        let bg = ctx.createLinearGradient(0, 0, 0, size);
        bg.addColorStop(0, mainColor);
        bg.addColorStop(1, otherColor);

        for (let i = 0; i < 6; i++) {
            if (texts[i] == "TOP") {
                ctx.fillStyle = mainColor;
            } else if (texts[i] == "BOTTOM") {
                ctx.fillStyle = otherColor;
            } else {
                ctx.fillStyle = bg;
            }
            ctx.fillRect(0, 0, size, size);
            ctx.strokeStyle = "#aaa";
            ctx.setLineDash([8, 8]);
            ctx.lineWidth = 4;
            ctx.strokeRect(0, 0, size, size);
            ctx.fillStyle = "#999";
            ctx.fillText(texts[i], size / 2, size / 2);
            materials[i] = new THREE.MeshBasicMaterial({
                map: textureLoader.load(canvas.toDataURL()),
            });
        }
        let cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
        this.cubeScene.add(cube);
        //#endregion

        //#region Planes
        let planes:any[] = [];

        let planeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x00c0ff,
            transparent: true,
            opacity: 0,
            depthTest: false,
        });
        let planeSize = 0.7;
        let planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);

        let a = 0.51;

        let plane1 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
        plane1.position.z = a;
        this.cubeScene.add(plane1);
        planes.push(plane1);

        let plane2 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
        plane2.position.z = -a;
        this.cubeScene.add(plane2);
        planes.push(plane2);

        let plane3 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
        plane3.rotation.y = Math.PI / 2;
        plane3.position.x = a;
        this.cubeScene.add(plane3);
        planes.push(plane3);

        let plane4 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
        plane4.rotation.y = Math.PI / 2;
        plane4.position.x = -a;
        this.cubeScene.add(plane4);
        planes.push(plane4);

        let plane5 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
        plane5.rotation.x = Math.PI / 2;
        plane5.position.y = a;
        this.cubeScene.add(plane5);
        planes.push(plane5);

        let plane6 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
        plane6.rotation.x = Math.PI / 2;
        plane6.position.y = -a;
        this.cubeScene.add(plane6);
        planes.push(plane6);
        //#endregion

        //#region Event Handler
        let activePlane:any = null;
        let hasMoved = false;
        this.cubeRenderer.domElement.onmousemove = (evt) => {
            this.isUpdatingFromMain = false;
            this.isUpdatingFromCube = true;
            if (activePlane) {
                activePlane.material.opacity = 0;
                activePlane.material.needsUpdate = true;
                activePlane = null;
                this.cubeRenderer.render(this.cubeScene, this.cubeCamera);
            }

            let x = evt.offsetX;
            let y = evt.offsetY;
            let size = this.cubeRenderer.getSize(new THREE.Vector2());
            let mouse = new THREE.Vector2(
                (x / size.width) * 2 - 1,
                (-y / size.height) * 2 + 1
            );

            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.cubeCamera);
            let intersects = raycaster.intersectObjects(planes.concat(cube));

            if (intersects.length > 0 && intersects[0].object != cube) {
                activePlane = intersects[0].object;
                activePlane.material.opacity = 0.2;
                activePlane.material.needsUpdate = true;
                this.cubeRenderer.render(this.cubeScene, this.cubeCamera);
            }
        };

        // let startTime = 0;
        // let duration = 500;
        let oldPosition = new THREE.Vector3();
        let newPosition = new THREE.Vector3();
        // let play = false;

        this.cubeRenderer.domElement.onclick = (evt) => {

            this.cubeRenderer.domElement.onmousemove(evt);

            if (!activePlane || hasMoved) {
                return false;
            }

            oldPosition.copy(this.cubeCamera.position);
            let currentPoint = new THREE.Vector3();
            this.cubeCameraControls.getTarget(currentPoint);
            let distance = this.cubeCamera.position
                .clone()
                .sub(new THREE.Vector3(0, 0, 0))
                .length();
            // newPosition.copy(this.cubeCameraControls.getPosition());

            if (activePlane.position.x !== 0) {
                newPosition.x += activePlane.position.x < 0 ? -distance : distance;
            } else if (activePlane.position.y !== 0) {
                newPosition.y += activePlane.position.y < 0 ? -distance : distance;
            } else if (activePlane.position.z !== 0) {
                newPosition.z += activePlane.position.z < 0 ? -distance : distance;
            }
            this.cubeCameraControls.setPosition(
                (activePlane.position.x / 0.51) * 2,
                (activePlane.position.y / 0.51) * 2,
                (activePlane.position.z / 0.51) * 2,
            );
        };
        //#endregion
    }
    private updateCube() {
        this.cubeCamera.rotation.copy(this.camera.rotation);
        let mainCameraTarget = new THREE.Vector3();
        this.cameraControls.getTarget(mainCameraTarget);
        let dir = this.camera.position
            .clone()
            .sub(mainCameraTarget)
            .normalize();
        this.cubeCamera.position.copy(dir.multiplyScalar(2));
        this.cubeCameraControls.setPosition(
            this.cubeCamera.position.x,
            this.cubeCamera.position.y,
            this.cubeCamera.position.z
        );
        // this.cubeRenderer.render(this.cubeScene, this.cubeCamera);
    }
    private updateMain() {
        this.camera.rotation.copy(this.cubeCamera.rotation);
        let cubeCameraTarget = new THREE.Vector3();
        this.cubeCameraControls.getTarget(cubeCameraTarget);
        let dir = this.camera.position
            .clone()
            .sub(cubeCameraTarget)
            .normalize();
        let length = this.camera.position.distanceTo(cubeCameraTarget);
        this.camera.position.copy(dir.multiplyScalar(length));
        if (this.cameraControls) {
            this.cameraControls.setPosition(
                this.camera.position.x,
                this.camera.position.y,
                this.camera.position.z
            );
        }

        this.renderer.render(this.scene, this.camera);
    }

}