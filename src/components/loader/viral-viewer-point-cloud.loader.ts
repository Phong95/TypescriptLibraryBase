import { Potree, PointSizeType, PointShape, PointColorType, PointCloudOctree } from "potree-core-viral";
import { ViralViewerApi } from "../../viral-viewer-api";

export class ViralViewerPointCloudLoader {
    potree: Potree = new Potree();
    pointClouds: PointCloudOctree[] = [];
    constructor(public viralViewerApi: ViralViewerApi) {
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

            this.viralViewerApi.viralScene.addObject(pco);
            this.pointClouds.push(pco);
            callbackOnSuccess(pco);
        });
    }
}