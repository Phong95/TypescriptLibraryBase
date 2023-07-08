import { Vector2 } from "three";
import { ViralViewerApi } from "../../viral-viewer-api";

export class ViralMouse {
    position = new Vector2();
    rawPosition = new Vector2();

    constructor(public viralViewerApi: ViralViewerApi) {
        this.setupMousePositionUpdate(this.viralViewerApi.viralRenderer.renderer.domElement);
    }

    private setupMousePositionUpdate(domElement: HTMLCanvasElement) {
        domElement.onmousemove = (event: MouseEvent) => {
            this.rawPosition.x = event.clientX;
            this.rawPosition.y = event.clientY;
            const bounds = domElement.getBoundingClientRect();
            this.position.x = ((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1;
            this.position.y = -((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1;
        };
    }
}
