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
        this.viralAnimation.animation();

    }

  
}