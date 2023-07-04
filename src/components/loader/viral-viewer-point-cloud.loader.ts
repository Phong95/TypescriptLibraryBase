import { Potree, PointSizeType, PointShape, PointColorType, PointCloudOctree } from "potree-core-viral";
import { ViralViewerApi } from "../../viral-viewer-api";

export class ViralViewerPointCloudLoader {
    potree: Potree;
    pointClouds: PointCloudOctree[] = [];
    viralViewerApi: ViralViewerApi;
    constructor(viralViewerApi: ViralViewerApi) {
        if (viralViewerApi) {
            this.viralViewerApi = viralViewerApi;
        }
        this.potree = new Potree();
    }
    /**
     * 
     * @param metadataUrl endpoint to download metadata.json
     * @param urlOcbinTree endpoint to download octree.bin
     * @param urlHierarchy endpoint to download hierarchy.bin
     * @param pointBudget 
     */
    public load(metadataUrl: string, urlOcbinTree: string, urlHierarchy: string, pointBudget: number = 2000000, callbackOnSuccess = (pco: PointCloudOctree) => { }) {
        this.potree.pointBudget = pointBudget;
        this.potree.loadPointCloudCustom(
            metadataUrl,
            urlOcbinTree,
            urlHierarchy
        ).then((pco: PointCloudOctree) => {
            let material = pco.material;
            material.size = 1;
            material.pointSizeType = PointSizeType.ADAPTIVE;
            material.shape = PointShape.CIRCLE;
            material.pointColorType = PointColorType.RGB;

            this.viralViewerApi.scene.add(pco);
            this.pointClouds.push(pco);
            callbackOnSuccess(pco);
        });
    }
    public anim() {
        const delta = this.viralViewerApi.clock.getDelta();
        const updated = this.viralViewerApi.viralCamera.cameraControls.update(delta);
        this.potree.updatePointClouds(this.pointClouds, this.viralViewerApi.viralCamera.camera, this.viralViewerApi.renderer);
        // if ( elapsed > 30 ) { return; }

        requestAnimationFrame(() => { this.anim() });
        // console.log(updated)
        if (updated) {
            this.viralViewerApi.renderer.render(this.viralViewerApi.scene, this.viralViewerApi.viralCamera.camera);
        }
    }
}