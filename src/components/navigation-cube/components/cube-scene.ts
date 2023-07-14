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
    SphereGeometry,
    TextureLoader,
    DoubleSide,
    PlaneGeometry
} from 'three';
import { ViralNavigationCube } from '../viral-navigation-cube';
export class CubeScene {
    scene: Scene = new Scene();
    objects: Object3D[] = [];
    cube: Mesh | null = null;
    planes: Mesh<PlaneGeometry, MeshBasicMaterial>[] = [];
    activePlane: Mesh<PlaneGeometry, MeshBasicMaterial> | null = null;

    constructor(public viralNavigationCube: ViralNavigationCube) {
        this.addCube();
        this.addPlanes();
    }
    public addObject(object: Object3D) {
        this.scene.add(object);
        this.objects.push(object);
    }

    public addCube() {
        let materials: any[] = [];
        let texts = ["RIGHT", "LEFT", "TOP", "BOTTOM", "FRONT", "BACK"];

        let textureLoader = new TextureLoader();
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let size = 64;
        canvas.width = size;
        canvas.height = size;
        if (ctx) {
            ctx.font = 'bolder 12px "Open sans", Arial';
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            let mainColor = "#fff";
            let otherColor = "#ccc";

            let bg = ctx.createLinearGradient(0, 0, 0, size);
            bg.addColorStop(0, mainColor);
            bg.addColorStop(1, otherColor);

            for (let i = 0; i < 6; i++) {
                if (texts[i] == "TOP") {
                    ctx.fillStyle = mainColor;
                } else if (texts[i] == "BOTTOM") {
                    ctx.fillStyle = otherColor;
                } else {
                    ctx.fillStyle = bg;
                }
                ctx.fillRect(0, 0, size, size);
                ctx.strokeStyle = "#aaa";
                ctx.setLineDash([8, 8]);
                ctx.lineWidth = 4;
                ctx.strokeRect(0, 0, size, size);
                ctx.fillStyle = "#999";
                ctx.fillText(texts[i], size / 2, size / 2);
                materials[i] = new MeshBasicMaterial({
                    map: textureLoader.load(canvas.toDataURL()),
                });
            }
            this.cube = new Mesh(new BoxGeometry(1, 1, 1), materials);
            this.addObject(this.cube)
        }
    }

    public addPlanes() {
        let planeMaterial = new MeshBasicMaterial({
            side: DoubleSide,
            color: 0x00c0ff,
            transparent: true,
            opacity: 0,
            depthTest: false,
        });
        let planeSize = 0.7;
        let planeGeometry = new PlaneGeometry(planeSize, planeSize);

        let a = 0.51;

        let plane1 = new Mesh(planeGeometry, planeMaterial.clone());
        plane1.position.z = a;
        this.planes.push(plane1);

        let plane2 = new Mesh(planeGeometry, planeMaterial.clone());
        plane2.position.z = -a;
        this.planes.push(plane2);

        let plane3 = new Mesh(planeGeometry, planeMaterial.clone());
        plane3.rotation.y = Math.PI / 2;
        plane3.position.x = a;
        this.planes.push(plane3);

        let plane4 = new Mesh(planeGeometry, planeMaterial.clone());
        plane4.rotation.y = Math.PI / 2;
        plane4.position.x = -a;
        this.planes.push(plane4);

        let plane5 = new Mesh(planeGeometry, planeMaterial.clone());
        plane5.rotation.x = Math.PI / 2;
        plane5.position.y = a;
        this.planes.push(plane5);

        let plane6 = new Mesh(planeGeometry, planeMaterial.clone());
        plane6.rotation.x = Math.PI / 2;
        plane6.position.y = -a;
        this.planes.push(plane6);

        let groundMaterial = new MeshBasicMaterial({
            color: 0xaaaaaa,
        });
        let groundGeometry = new PlaneGeometry(1, 1);
        let groundPlane = new Mesh(groundGeometry, groundMaterial);
        groundPlane.rotation.x = -Math.PI / 2;
        groundPlane.position.y = -0.6;


        this.addObject(plane1);
        this.addObject(plane2);
        this.addObject(plane3);
        this.addObject(plane4);
        this.addObject(plane5);
        this.addObject(plane6);
        this.addObject(groundPlane);
    }

}