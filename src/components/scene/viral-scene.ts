import {
    Scene,
    DirectionalLight,
    AmbientLight,
    Mesh,
    BoxGeometry,
    MeshStandardMaterial,
    AxesHelper,
    Object3D,
    MeshBasicMaterial,
    SphereGeometry
} from 'three';
import { ViralViewerApi } from '../../viral-viewer-api';

export class ViralScene {
    scene: Scene = new Scene();
    objects: Object3D[] = [];
    constructor(public viralViewerApi: ViralViewerApi) {
        this.setupLights();
        this.addPivotPoint();
    }
    public addObject(object: Object3D) {
        this.scene.add(object);
        this.objects.push(object);
    }
    public getObjectByName(name: string) {
        var object = this.scene.getObjectByName(name);
        return object;
    }
    public setupLights() {
        const light1 = new DirectionalLight(0xffeeff, 0.8);
        light1.position.set(1, 1, 1).normalize();
        const light2 = new DirectionalLight(0xffffff, 0.8);
        light2.position.set(-1, 0.5, -1).normalize();
        const ambientLight = new AmbientLight(0xffffee, 0.25);
        ambientLight.position.set(0, 0, 0).normalize();

        this.addObject(light1);
        this.addObject(light2);
        this.addObject(ambientLight);


    }

    public addCube() {
        if (this.scene) {
            const mesh = new Mesh(
                new BoxGeometry(1, 1, 1),
                new MeshStandardMaterial({ color: 0xff0000, wireframe: true })
            );
            this.addObject(mesh);
        }

    }
    public addAxes() {
        if (this.scene) {
            const axesHelper = new AxesHelper(5);
            this.addObject(axesHelper);
        }

    }
    public addPivotPoint() {
        const sphereGeometry = new SphereGeometry(1, 32, 32);
        const sphereMaterial = new MeshBasicMaterial({
            color: 0x659F51,
            transparent: true,
            opacity: 0.5
        });
        const sphere = new Mesh(sphereGeometry, sphereMaterial);
        sphere.name = "Viral Pivot Point";
        sphere.visible = false;
        this.addObject(sphere)
    }
}
