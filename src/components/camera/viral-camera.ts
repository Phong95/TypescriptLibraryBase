import CameraControls from "camera-controls";
import { ViewerOptions, ViralPoint, ViralViewerState } from "../../types";
import { ViralViewerApi } from "../../viral-viewer-api";
import {
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    PerspectiveCamera,
    Object3D,
    MathUtils
} from 'three';
const subsetOfTHREE = {
    Vector2: Vector2,
    Vector3: Vector3,
    Vector4: Vector4,
    Quaternion: Quaternion,
    Matrix4: Matrix4,
    Spherical: Spherical,
    Box3: Box3,
    Sphere: Sphere,
    Raycaster: Raycaster,
    MathUtils: MathUtils,
};


export class ViralCamera {
    raycaster: Raycaster | null = null;
    camera: PerspectiveCamera | null = null;
    cameraControls: CameraControls | null = null;
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
        CameraControls.install({ THREE: subsetOfTHREE });
        this.cameraControls = new CameraControls(this.camera, this.viralViewerApi.viralRenderer.renderer.domElement);

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
        if (this.camera) {
            this.camera.aspect = this.targetElement.clientWidth / this.targetElement.clientHeight;
            this.camera.updateProjectionMatrix();
            this.viralViewerApi.viralRenderer.renderer.setSize(this.targetElement.clientWidth, this.targetElement.clientHeight);
            this.viralViewerApi.viralRenderer.render();
        }


    }

    /**
     * focuse model 
     * @param objectName :model name
     */
    public focusModelByName(objectName: string) {
        var object: any = this.viralViewerApi.viralScene.scene.getObjectByName(objectName);
        if (object && this.cameraControls) {
            var bbox = new Box3().setFromObject(object);
            this.cameraControls.fitToBox(bbox as any, true);
        }
    }

    public getState(): ViralViewerState | null {
        if (this.cameraControls) {
            let result: ViralViewerState = {
                CameraPoint: { X: 0, Y: 0, Z: 0 },
                TargetPoint: { X: 0, Y: 0, Z: 0 },

            };
            let cameraPoint1: Vector3 = new Vector3(0, 0, 0);
            let point = this.cameraControls.getPosition(cameraPoint1!);
            result.CameraPoint = { X: point.x, Y: point.y, Z: point.z }
            let cameraPoint2: Vector3 = new Vector3(0, 0, 0);
            let point2 = this.cameraControls.getTarget(cameraPoint2!);
            result.TargetPoint = { X: point2.x, Y: point2.y, Z: point2.z }
            return result;
        }
        return null;
    }

    public restoreState(state: ViralViewerState) {
        if (this.cameraControls) {
            this.cameraControls.setPosition(state.CameraPoint.X, state.CameraPoint.Y, state.CameraPoint.Z, true);
            this.cameraControls.setTarget(state.TargetPoint.X, state.TargetPoint.Y, state.TargetPoint.Z, true);
        }

    }

    public clientToWorld() {
        return this.castRay(this.viralViewerApi.viralScene.objects);
    }
    public worldToClient(point: Vector3) {
        if (this.camera) {
            let clonePoint = new Vector3(point.x, point.y, point.z)
            this.camera.updateMatrixWorld(true);
            let cameraPoint = clonePoint.project(this.camera);
            cameraPoint.x = (cameraPoint.x + 1) * this.targetElement!.offsetWidth / 2;
            cameraPoint.y = - (cameraPoint.y - 1) * this.targetElement!.offsetHeight / 2;
            cameraPoint.z = 0;

            return cameraPoint;
        }
        return null;
    }
    private castRay(items: Object3D[]) {
        if (this.camera && this.raycaster && this.viralViewerApi.viralMouse) {
            this.raycaster.setFromCamera(this.viralViewerApi.viralMouse.position, this.camera);
            return this.raycaster.intersectObjects(items);
        }
        return null;
    }

    public updateMainCamera() {
        if (this.viralViewerApi.viralNavigationCube.cubeCamera && this.viralViewerApi.viralNavigationCube.cubeCamera.camera && this.viralViewerApi.viralNavigationCube.cubeCamera.cameraControls) {

            let cameraControlTarget = new Vector3();
            this.cameraControls!.getTarget(cameraControlTarget)
            let cameraControlPosition = new Vector3();
            this.cameraControls!.getPosition(cameraControlPosition)
            //Hiệu 2 vector của main
            let mainVector = cameraControlTarget.sub(cameraControlPosition);
            let length = mainVector.length();


            let cubeCameraControlTarget = new Vector3();
            this.viralViewerApi.viralNavigationCube.cubeCamera.cameraControls!.getTarget(cubeCameraControlTarget)
            let cubeCameraControlPosition = new Vector3();
            this.viralViewerApi.viralNavigationCube.cubeCamera.cameraControls!.getPosition(cubeCameraControlPosition)
            //Hiệu 2 vector của cube
            let vector = cubeCameraControlTarget.sub(cubeCameraControlPosition);
            //Chuẩn hoá
            vector.normalize();
            //Chỉnh độ lớn của vector về độ lớn khoảng cách giữa camera chính và điểm nhìn trước đó
            vector.multiplyScalar(length);
            this.cameraControls?.setPosition(vector.x, vector.y, vector.z);
        }

    }
}