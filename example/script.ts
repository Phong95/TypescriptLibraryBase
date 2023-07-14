import CameraControls from 'camera-controls';
import * as THREE from 'three';
import { ViralViewerApi } from 'viral-viewer-2';
CameraControls.install({ THREE: THREE });

export class TestingViralViewerLib {
    private viralViewerApi: ViralViewerApi | null = null;
    private cubeScene: THREE.Scene | null = null;
    private cubeRenderer: THREE.WebGLRenderer | null = null;
    private cubeCamera: THREE.PerspectiveCamera | null = null;
    private cubeCameraControls: CameraControls | null = null;
    private cube: THREE.Mesh | null = null;
    private clock = new THREE.Clock();
    private activePlane: any = null;
    private planes: any[] = [];
    private oldPosition = new THREE.Vector3();
    private newPosition = new THREE.Vector3();
    private hasMoved = false;
    private cubeCameraDistance = 1.75;

    public async loadModel() {
        const container = document.getElementById('container');
        if (container) {
            this.viralViewerApi = new ViralViewerApi({ cameraZUp: false, container: container });
            this.viralViewerApi!.viralAnimation.mainAnimation();
            this.viralViewerApi!.viralAnimation.cubeAnimation();
            if (this.viralViewerApi.worker) {
                // let model = await this.viralViewerApi.compressProcessor.decompressed('./public/Cofico_Office-FM-220829.json');
                let model = await this.viralViewerApi.compressProcessor.decompressed('./public/MarubeniCoffee.json');
                if (model) {
                    this.viralViewerApi.worker.loadModel(model, () => {
                        this.viralViewerApi!.viralCamera.focusModelByName('Viral Model');


                        // this.injectCubeWrapperElement();
                    })
                }

            }
        }
    }
    public injectCubeWrapperElement() {
        const container = document.getElementById('container');

        if (container) {
            container.innerHTML += `<div style="position: absolute;
                right: 10px;
                top: 10px;
                display: flex;">
                <svg xmlns="http://www.w3.org/2000/svg" style="fill:white;cursor: pointer;" height="20px" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"/></svg>
                        <div id="orientCubeWrapper" style="height:130px;width:130px"></div>
                    </div>`
        }


    }
    public addCube() {
        const cubeWrapper = document.getElementById("orientCubeWrapper");
        if (cubeWrapper) {
            const width = cubeWrapper.offsetWidth;
            const height = cubeWrapper.offsetHeight;

            this.cubeScene = new THREE.Scene();

            this.cubeRenderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                logarithmicDepthBuffer: true,
            });
            this.cubeRenderer.setClearColor(0x000000, 0);
            this.cubeRenderer.setSize(width, height);
            cubeWrapper.appendChild(this.cubeRenderer.domElement);

            this.cubeCamera = new THREE.PerspectiveCamera();
            this.cubeCamera = new THREE.PerspectiveCamera(60, width / height, 0.01, 100);
            this.cubeCamera.position.set(0, 0, 2);
            this.cubeCameraControls = new CameraControls(this.cubeCamera, this.cubeRenderer.domElement);
            this.cubeCameraControls.dollyToCursor = false;
            this.cubeCameraControls.infinityDolly = false;
            this.cubeCameraControls.setTarget(0, 0, 0);
            this.cubeCameraControls.polarRotateSpeed = 0.15;
            this.cubeCameraControls.azimuthRotateSpeed = 0.15;
            this.cubeCameraControls.mouseButtons.middle = CameraControls.ACTION.NONE;
            this.cubeCameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;

            //#region Cube
            let materials: any[] = [];
            let texts = ["RIGHT", "LEFT", "TOP", "BOTTOM", "FRONT", "BACK"];

            let textureLoader = new THREE.TextureLoader();
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");

            let size = 64;
            canvas.width = size;
            canvas.height = size;
            if (ctx) {
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
                this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
                this.cubeScene.add(this.cube);
            }

            //#endregion

            //#region Planes

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
            this.planes.push(plane1);

            let plane2 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
            plane2.position.z = -a;
            this.cubeScene.add(plane2);
            this.planes.push(plane2);

            let plane3 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
            plane3.rotation.y = Math.PI / 2;
            plane3.position.x = a;
            this.cubeScene.add(plane3);
            this.planes.push(plane3);

            let plane4 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
            plane4.rotation.y = Math.PI / 2;
            plane4.position.x = -a;
            this.cubeScene.add(plane4);
            this.planes.push(plane4);

            let plane5 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
            plane5.rotation.x = Math.PI / 2;
            plane5.position.y = a;
            this.cubeScene.add(plane5);
            this.planes.push(plane5);

            let plane6 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
            plane6.rotation.x = Math.PI / 2;
            plane6.position.y = -a;
            this.cubeScene.add(plane6);
            this.planes.push(plane6);

            let groundMaterial = new THREE.MeshBasicMaterial({
                color: 0xaaaaaa,
            });
            let groundGeometry = new THREE.PlaneGeometry(1, 1);
            let groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
            groundPlane.rotation.x = -Math.PI / 2;
            groundPlane.position.y = -0.6;

            this.cubeScene.add(groundPlane);
            //#endregion

            //#region Change Event
            this.cubeRenderer.domElement.onmousemove = this.handleMousemMove;

            let startTime = 0;
            let duration = 500;


            this.cubeRenderer.domElement.onclick = this.handleMouseClick

            // this.cubeRenderer.domElement.ontouchmove = (e: any) => {
            //     let rect = e.target!.getBoundingClientRect();
            //     let x = e.targetTouches[0].pageX - rect.left;
            //     let y = e.targetTouches[0].pageY - rect.top;
            //     this.handleMousemMove({ ...e, offsetX: x, offsetY: y })

            // }

            // this.cubeRenderer.domElement.ontouchstart = (e: any) => {
            //     let rect = e.target.getBoundingClientRect();
            //     let x = e.targetTouches[0].pageX - rect.left;
            //     let y = e.targetTouches[0].pageY - rect.top;
            //     this.handleMouseClick({ ...e, offsetX: x, offsetY: y })
            // }



            //#endregion

            this.cubeRenderer.render(this.cubeScene, this.cubeCamera);
            this.anim();
        }
    }
    private anim() {
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();
        if (this.cubeCameraControls) {
            const updated = this.cubeCameraControls!.update(delta!);

            requestAnimationFrame(() => { this.anim() });
            if (updated) {
                this.cubeRenderer!.render(this.cubeScene!, this.cubeCamera!);
            }
        }

    }
    private handleMousemMove = async (_event: MouseEvent) => {
        if (this.activePlane) {
            this.activePlane.material.opacity = 0;
            this.activePlane.material.needsUpdate = true;
            this.activePlane = null;
        }

        let x = _event.offsetX;
        let y = _event.offsetY;
        let size = this.cubeRenderer!.getSize(new THREE.Vector2());
        let mouse = new THREE.Vector2(x / size.width * 2 - 1, -y / size.height * 2 + 1);

        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.cubeCamera!);
        let intersects = raycaster.intersectObjects(this.planes.concat(this.cube));

        if (intersects.length > 0 && intersects[0].object != this.cube) {
            this.activePlane = intersects[0].object;
            this.activePlane.material.opacity = 0.2;
            this.activePlane.material.needsUpdate = true;
        }
    }
    private handleMouseClick = async (_event: MouseEvent) => {
        console.log(_event)
        this.handleMousemMove(_event);


        if (!this.activePlane || this.hasMoved) {
            console.log("false");
            return false;
        }

        this.oldPosition.copy(this.cubeCamera!.position);
        let currentPoint = new THREE.Vector3();
        this.cubeCameraControls!.getTarget(currentPoint);
        let cubeCameraControlsPosition = new THREE.Vector3();
        this.cubeCameraControls!.getPosition(cubeCameraControlsPosition)
        let distance = this.cubeCamera!.position
            .clone()
            .sub(new THREE.Vector3(0, 0, 0))
            .length();
        this.newPosition.copy(cubeCameraControlsPosition);

        if (this.activePlane.position.x !== 0) {
            this.newPosition.x += this.activePlane.position.x < 0 ? -distance : distance;
        } else if (this.activePlane.position.y !== 0) {
            this.newPosition.y += this.activePlane.position.y < 0 ? -distance : distance;
        } else if (this.activePlane.position.z !== 0) {
            this.newPosition.z += this.activePlane.position.z < 0 ? -distance : distance;
        }
        this.cubeCameraControls!.setPosition(
            (this.activePlane.position.x / 0.51) * 2,
            (this.activePlane.position.y / 0.51) * 2,
            (this.activePlane.position.z / 0.51) * 2,
        );
    }
    private updateCubeCamera() {
        this.cubeCamera!.rotation.copy(this.viralViewerApi!.viralCamera!.camera!.rotation);
        let cameraControlTarget = new THREE.Vector3();
        this.viralViewerApi!.viralCamera!.cameraControls!.getTarget(cameraControlTarget)
        let dir = this.viralViewerApi!.viralCamera!.camera!.position.clone().sub(cameraControlTarget).normalize();
        this.cubeCamera!.position.copy(dir.multiplyScalar(this.cubeCameraDistance));
    }
}
let testingViralViewerLib = new TestingViralViewerLib();
// testingViralViewerLib.injectCubeWrapperElement();
await testingViralViewerLib.loadModel();
// testingViralViewerLib.addCube()



