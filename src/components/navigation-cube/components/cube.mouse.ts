import { ViralNavigationCube } from "../viral-navigation-cube";
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
export class CubeMouse {

    constructor(public viralNavigationCube: ViralNavigationCube) {
        if (this.viralNavigationCube.cubeRenderer) {
            this.setupMouseClick(this.viralNavigationCube.cubeRenderer.renderer.domElement);
            this.setupMouseMove(this.viralNavigationCube.cubeRenderer.renderer.domElement);

        }

    }
    //#region Mouse Click
    private setupMouseClick(domElement: HTMLCanvasElement) {
        domElement.onclick = this.handleClick;

    }
    private handleClick = async (_event: MouseEvent) => {
        if (!this.viralNavigationCube.cubeScene?.activePlane || this.viralNavigationCube.cubeCamera?.cameraControlHasMoved) {
            console.log("false");
            return false;
        }

        this.viralNavigationCube.cubeCamera?.cameraControlOldPosition!.copy(this.viralNavigationCube.cubeCamera?.camera?.position!);
        let currentPoint = new Vector3();
        this.viralNavigationCube.cubeCamera?.cameraControls!.getTarget(currentPoint);
        let cubeCameraControlsPosition = new Vector3();
        this.viralNavigationCube.cubeCamera?.cameraControls!.getPosition(cubeCameraControlsPosition)
        let distance = this.viralNavigationCube.cubeCamera?.camera?.position
            .clone()
            .sub(new Vector3(0, 0, 0))
            .length();
        this.viralNavigationCube.cubeCamera?.cameraControlNewPosition!.copy(cubeCameraControlsPosition);

        if (this.viralNavigationCube.cubeScene?.activePlane.position.x !== 0) {
            this.viralNavigationCube.cubeCamera!.cameraControlNewPosition!.x += this.viralNavigationCube.cubeScene?.activePlane.position.x < 0 ? -distance! : distance!;
        } else if (this.viralNavigationCube.cubeScene?.activePlane.position.y !== 0) {
            this.viralNavigationCube.cubeCamera!.cameraControlNewPosition!.y += this.viralNavigationCube.cubeScene?.activePlane.position.y < 0 ? -distance! : distance!;
        } else if (this.viralNavigationCube.cubeScene?.activePlane.position.z !== 0) {
            this.viralNavigationCube.cubeCamera!.cameraControlNewPosition!.z += this.viralNavigationCube.cubeScene?.activePlane.position.z < 0 ? -distance! : distance!;
        }
        this.viralNavigationCube.cubeCamera?.cameraControls!.setPosition(
            (this.viralNavigationCube.cubeScene?.activePlane.position.x / 0.51) * 2,
            (this.viralNavigationCube.cubeScene?.activePlane.position.y / 0.51) * 2,
            (this.viralNavigationCube.cubeScene?.activePlane.position.z / 0.51) * 2,
        );
    }
    //#endregion

    //#region Mouse Move
    private setupMouseMove(domElement: HTMLCanvasElement) {
        domElement.onmousemove = this.handleMove;

    }
    private handleMove = async (_event: MouseEvent) => {
        if (this.viralNavigationCube.cubeScene?.activePlane) {
            this.viralNavigationCube.cubeScene.activePlane.material.opacity = 0;
            this.viralNavigationCube.cubeScene.activePlane.material.needsUpdate = true;
            this.viralNavigationCube.cubeScene.activePlane = null;
        }

        let x = _event.offsetX;
        let y = _event.offsetY;
        let size = this.viralNavigationCube.cubeRenderer?.renderer!.getSize(new Vector2());
        let mouse = new Vector2(x / size!.width * 2 - 1, -y / size!.height * 2 + 1);

        let raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, this.viralNavigationCube.cubeCamera?.camera!);
        let intersects = raycaster.intersectObjects(this.viralNavigationCube.cubeScene?.objects!);

        if (intersects.length > 0 && intersects[0].object != this.viralNavigationCube.cubeScene?.cube) {
            this.viralNavigationCube.cubeScene!.activePlane! = intersects[0].object as any;
            this.viralNavigationCube.cubeScene!.activePlane!.material.opacity = 0.2;
            this.viralNavigationCube.cubeScene!.activePlane!.material.needsUpdate = true;
        }
    }
    //#endregion
}
