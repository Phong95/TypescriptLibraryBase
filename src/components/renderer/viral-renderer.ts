import {
    Clock,
    WebGLRenderer,
} from 'three';
import { ViralViewerApi } from '../../viral-viewer-api';

export class ViralRenderer {
    renderer: WebGLRenderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        logarithmicDepthBuffer: true,
        powerPreference: "high-performance",
    });
    constructor(public viralViewerApi: ViralViewerApi) {
        this.setupRenderer();
    }
    public setupRenderer() {
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(this.viralViewerApi.targetElement.offsetWidth, this.viralViewerApi.targetElement.offsetHeight);
        this.viralViewerApi.targetElement.appendChild(this.renderer.domElement);
    }
    public render() {
        if (this.viralViewerApi.viralCamera && this.viralViewerApi.viralCamera.camera)
            this.renderer.render(this.viralViewerApi.viralScene.scene, this.viralViewerApi.viralCamera.camera);

    }
}

