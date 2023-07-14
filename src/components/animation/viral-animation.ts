import { Clock } from "three";
import { ViralViewerApi } from "../../viral-viewer-api";

export class ViralAnimation {
    mainClock: Clock = new Clock();
    cubeClock: Clock = new Clock();
    isUpdatingCubeFromMain = false;
    isUpdatingMainFromCube = false;
    constructor(public viralViewerApi: ViralViewerApi) {

    }
    public mainAnimation() {
        const delta = this.mainClock.getDelta();
        const elapsed = this.mainClock.getElapsedTime();
        const updated = this.viralViewerApi.viralCamera.cameraControls?.update(delta);
        if (this.viralViewerApi.pointCloudLoader.pointClouds.length > 0 && this.viralViewerApi.viralCamera.camera) {
            this.viralViewerApi.pointCloudLoader.potree.updatePointClouds(this.viralViewerApi.pointCloudLoader.pointClouds, this.viralViewerApi.viralCamera.camera, this.viralViewerApi.viralRenderer.renderer);

        }

        requestAnimationFrame(() => { this.mainAnimation });

        if (updated) {
            this.viralViewerApi.viralRenderer.render();
            if (this.viralViewerApi.viralNavigationCube.cubeCamera && this.isUpdatingMainFromCube == false) {
                this.isUpdatingCubeFromMain = true;
                this.viralViewerApi.viralNavigationCube.cubeCamera.updateCubeCamera();
                this.isUpdatingCubeFromMain = false;
            }
        }

    }
    public cubeAnimation() {
        if (this.viralViewerApi.viralNavigationCube.cubeCamera && this.viralViewerApi.viralNavigationCube.cubeCamera.cameraControls) {
            const delta = this.cubeClock.getDelta();
            const elapsed = this.cubeClock.getElapsedTime();
            const updated = this.viralViewerApi.viralNavigationCube.cubeCamera.cameraControls?.update(delta);

            requestAnimationFrame(() => { this.cubeAnimation });

            if (updated) {
                this.viralViewerApi.viralNavigationCube.cubeRenderer?.render();
                console.log(this.isUpdatingCubeFromMain)
                if (this.viralViewerApi.viralCamera && this.isUpdatingCubeFromMain == false) {
                    this.isUpdatingMainFromCube = true;

                    this.viralViewerApi.viralCamera.updateMainCamera();
                    this.isUpdatingMainFromCube = false;

                }
            }
        }

    }
}