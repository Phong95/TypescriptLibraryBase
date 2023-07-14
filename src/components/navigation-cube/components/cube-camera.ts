import CameraControls from "camera-controls";
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
import { ViralNavigationCube } from "../viral-navigation-cube";
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

export class CubeCamera {
    camera: PerspectiveCamera | null = null;
    cameraControls: CameraControls | null = null;
    cameraControlOldPosition: Vector3 = new Vector3();
    cameraControlNewPosition: Vector3 = new Vector3();
    cameraControlHasMoved = false;
    constructor(public viralNavigationCube: ViralNavigationCube) {
        this.setupCamera();

    }
    public setupCamera() {
        if (this.viralNavigationCube.targetElement && this.viralNavigationCube.cubeRenderer) {
            const width = this.viralNavigationCube.targetElement.offsetWidth;
            const height = this.viralNavigationCube.targetElement.offsetHeight;
            this.camera = new PerspectiveCamera(60, width / height, 0.01, 100);
            this.camera.position.set(0, 0, 2);
            CameraControls.install({ THREE: subsetOfTHREE });
            this.cameraControls = new CameraControls(this.camera, this.viralNavigationCube.cubeRenderer.renderer.domElement);
            this.cameraControls.dollyToCursor = false;
            this.cameraControls.infinityDolly = false;
            this.cameraControls.setTarget(0, 0, 0);
            this.cameraControls.polarRotateSpeed = 0.15;
            this.cameraControls.azimuthRotateSpeed = 0.15;
            this.cameraControls.mouseButtons.middle = CameraControls.ACTION.NONE;
            this.cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE;
        }

    }
    public updateCubeCamera() {
        let cameraControlTarget = new Vector3();
        this.viralNavigationCube.viralViewerApi!.viralCamera!.cameraControls!.getTarget(cameraControlTarget)
        let cameraControlPosition = new Vector3();
        this.viralNavigationCube.viralViewerApi!.viralCamera!.cameraControls!.getPosition(cameraControlPosition)
        //Hieu 2 vector
        let vector = cameraControlPosition.sub(cameraControlTarget);
        //Chuan hoa
        vector.normalize();
        //Do lon vector bang 2
        vector.multiplyScalar(2);
        this.cameraControls?.setPosition(vector.x, vector.y, vector.z);
    }
}