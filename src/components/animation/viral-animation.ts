import { Clock } from "three";
import { ViralViewerApi } from "../../viral-viewer-api";

export class ViralAnimation {
    clock: Clock = new Clock();
    constructor(public viralViewerApi: ViralViewerApi) {

    }
    public animation() {
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();
        const updated1 = this.viralViewerApi.viralCamera.cameraControls?.update(delta);
        if (this.viralViewerApi.pointCloudLoader.pointClouds.length > 0 && this.viralViewerApi.viralCamera.camera) {
            this.viralViewerApi.pointCloudLoader.potree.updatePointClouds(this.viralViewerApi.pointCloudLoader.pointClouds, this.viralViewerApi.viralCamera.camera, this.viralViewerApi.viralRenderer.renderer);

        }

        requestAnimationFrame(() => { this.animation() });

        if (updated1) {
            this.viralViewerApi.viralRenderer.render();
            // if (this.viralViewerApi.viralNavigationCube.cubeCamera) {
            //     this.viralViewerApi.viralNavigationCube.cubeCamera.updateCubeCamera();
            // }
        }
        if (this.viralViewerApi.viralNavigationCube.cubeCamera && this.viralViewerApi.viralNavigationCube.cubeCamera.cameraControls) {

            const updated2 = this.viralViewerApi.viralNavigationCube.cubeCamera.cameraControls?.update(delta);

            if (updated2) {
                this.viralViewerApi.viralNavigationCube.cubeRenderer?.render();
                this.viralViewerApi.viralCamera.updateMainCamera();
            }
        }
    }

}