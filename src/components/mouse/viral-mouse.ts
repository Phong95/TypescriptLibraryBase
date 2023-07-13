import { Vector2 } from "three";
import { ViralViewerApi } from "../../viral-viewer-api";

export class ViralMouse {
    position = new Vector2();
    rawPosition = new Vector2();

    constructor(public viralViewerApi: ViralViewerApi) {
        this.setupMousePositionUpdate(this.viralViewerApi.viralRenderer.renderer.domElement);
        this.setupMouseDown(this.viralViewerApi.targetElement);
        this.setupMouseUp(this.viralViewerApi.targetElement);
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
    //#region Mouse Down
    private setupMouseDown(domElement: HTMLElement) {
        domElement!.onmousedown = this.handleClick;

    }
    private handleClick = async (_event: Event) => {
        if (this.viralViewerApi) {
            let result = this.viralViewerApi.viralCamera.clientToWorld();
            if (result && result.length > 0) {
                let object = this.viralViewerApi.viralScene.getObjectByName("Viral Pivot Point");
                if (object) {
                    object.position.copy(result[0].point);
                    object.visible = true;
                }
                this.viralViewerApi.viralRenderer.render();
                this.viralViewerApi.viralCamera.camera?.updateMatrixWorld();
                this.viralViewerApi.viralCamera.cameraControls?.setOrbitPoint(result[0].point.x, result[0].point.y, result[0].point.z)
            }
        }
    };
    //#endregion

    //#region Mouse Up
    private setupMouseUp(domElement: HTMLElement) {
        domElement!.onmouseup = this.handleMouseUp;

    }
    private handleMouseUp = async (_event: Event) => {
        if (this.viralViewerApi) {
            let object = this.viralViewerApi.viralScene.getObjectByName("Viral Pivot Point");
            if (object) {
                object.visible = false;
            }
        }

    }
    //#endregion
}
