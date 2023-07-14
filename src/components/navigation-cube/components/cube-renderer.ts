import { Clock, WebGLRenderer } from "three";
import { ViralNavigationCube } from "../viral-navigation-cube";

export class CubeRenderer {
    // clock: Clock = new Clock();
    renderer: WebGLRenderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        logarithmicDepthBuffer: true,
    });
    constructor(public viralNavigationCube: ViralNavigationCube) {
        this.setupRenderer();
    }
    public setupRenderer() {
        if (this.viralNavigationCube.targetElement) {
            this.renderer.setClearColor(0x000000, 0);
            this.renderer.setSize(this.viralNavigationCube.targetElement.offsetWidth, this.viralNavigationCube.targetElement.offsetHeight);
            this.viralNavigationCube.targetElement.appendChild(this.renderer.domElement);

        }

    }
    public render() {
        if (this.viralNavigationCube.cubeScene && this.viralNavigationCube.cubeCamera && this.viralNavigationCube.cubeCamera.camera)
            this.renderer.render(this.viralNavigationCube.cubeScene.scene, this.viralNavigationCube.cubeCamera.camera);

    }
    // public anim() {
    //     if (this.viralNavigationCube.cubeCamera && this.viralNavigationCube.cubeCamera.cameraControls) {
    //         const delta = this.clock.getDelta();
    //         const elapsed = this.clock.getElapsedTime();
    //         const updated = this.viralNavigationCube.cubeCamera.cameraControls?.update(delta);

    //         requestAnimationFrame(() => { this.anim() });

    //         if (updated) {
    //             this.render();
    //             // if (this.viralNavigationCube.viralViewerApi.viralCamera) {
    //             //     this.viralNavigationCube.viralViewerApi.viralCamera.updateMainCamera();
    //             // }
    //         }
    //     }


    // }
}