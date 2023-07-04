import CameraControls from "camera-controls";
import { ViewerOptions, ViralPoint, ViralViewerState } from "../../types";
import { ViralViewerApi } from "../../viral-viewer-api";
import { Box3, Object3D, PerspectiveCamera, Raycaster, Vector2, Vector3 } from "three";

export class ViralCamera {
    raycaster: Raycaster;
    camera: PerspectiveCamera;
    cameraControls: CameraControls;
    targetElement: HTMLElement;
    constructor(public viralViewerApi: ViralViewerApi) {
        this.targetElement = this.viralViewerApi.options.container;
        this.setupCamera();
        this.setupRaycaster();
    }
    public setupCamera() {
        this.camera = new PerspectiveCamera(60, this.targetElement.offsetWidth / this.targetElement.offsetHeight, 0.01, 2000000);
        this.camera.position.set(0, 0, 2);
        if (this.viralViewerApi.options && this.viralViewerApi.options.cameraZUp) {
            this.camera.up.set(0, 0, 1);
            this.camera.position.set(100, 100, 0);
        }
        this.cameraControls = new CameraControls(this.camera, this.viralViewerApi.renderer.domElement);
        // this.cameraControls.dollyToCursor = true;
        this.cameraControls.infinityDolly = true;
        this.cameraControls.setTarget(0, 0, 0);
        this.cameraControls.mouseButtons.middle = CameraControls.ACTION.OFFSET;
        // this.anim();
    }
    public setupRaycaster() {
        this.raycaster = new Raycaster();
    }
    /**
     * resize canvas by resize div
     */
    public resizeCanvas() {
        this.camera.aspect = this.targetElement.clientWidth / this.targetElement.clientHeight;
        this.camera.updateProjectionMatrix();
        this.viralViewerApi.renderer.setSize(this.targetElement.clientWidth, this.targetElement.clientHeight);
        this.viralViewerApi.rerender();
    }

    /**
     * focuse model 
     * @param objectName :model name
     */
    public focusModelByName(objectName: string) {
        var object: any = this.viralViewerApi.scene.getObjectByName(objectName);
        if (object) {
            var bbox = new Box3().setFromObject(object);
            this.viralViewerApi.viralCamera.cameraControls.fitToBox(bbox as any, true);


        }


    }

    public getState(): ViralViewerState {
        let result: ViralViewerState = new ViralViewerState();
        let cameraPoint1: Vector3 = new Vector3(0, 0, 0);
        let point = this.cameraControls.getPosition(cameraPoint1!);
        result.CameraPoint = { X: point.x, Y: point.y, Z: point.z }
        let cameraPoint2: Vector3 = new Vector3(0, 0, 0);
        let point2 = this.cameraControls.getTarget(cameraPoint2!);
        result.TargetPoint = { X: point2.x, Y: point2.y, Z: point2.z }
        return result;
    }

    public restoreState(state: ViralViewerState) {
        this.cameraControls.setPosition(state.CameraPoint.X, state.CameraPoint.Y, state.CameraPoint.Z, true);
        this.cameraControls.setTarget(state.TargetPoint.X, state.TargetPoint.Y, state.TargetPoint.Z, true);
    }

    public clientToWorld() {

    }
    public worldToClient(point: Vector3) {
        let clonePoint = new Vector3(point.x, point.y, point.z)
        this.camera.updateMatrixWorld(true);
        let cameraPoint = clonePoint.project(this.camera);
        cameraPoint.x = (cameraPoint.x + 1) * this.targetElement!.offsetWidth / 2;
        cameraPoint.y = - (cameraPoint.y - 1) * this.targetElement!.offsetHeight / 2;
        cameraPoint.z = 0;

        return cameraPoint;
    }
    private castRay(items: Object3D[]) {
        this.raycaster.setFromCamera(this.viralViewerApi.viralMouse.position, this.camera);
        return this.raycaster.intersectObjects(items);
    }
}