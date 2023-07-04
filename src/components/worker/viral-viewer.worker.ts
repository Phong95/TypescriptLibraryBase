import { ViralViewerApi } from "../../viral-viewer-api";
import { ViralViewerRevitProject } from "../../types";
import { BufferAttribute, BufferGeometry, EdgesGeometry, LineBasicMaterial, LineSegments, Matrix4, Mesh, MeshPhongMaterial } from "three";

export class ViralViewerWorker {
    public worker: Worker;
    public viralViewerApi: ViralViewerApi;
    constructor(main: ViralViewerApi, scriptUrl: string) {
        this.worker = new Worker(scriptUrl, { type: "module" });
        this.viralViewerApi = main;
    }
    public loadModel(model: ViralViewerRevitProject, callbackOnSuccess = () => { }) {
        const noneStructuralMesh = new Mesh();
        noneStructuralMesh.name = "Viral Model";
        this.viralViewerApi.scene.add(noneStructuralMesh);
        this.worker.onmessage = (m) => {
            switch (m.data.type) {
                case 0:
                    this.worker.postMessage({
                        type: 1,
                        data: m.data.data,
                    });

                    break;
                case 1:
                    let buffer = m.data.buffer;
                    const geometry = new BufferGeometry();
                    geometry.setAttribute("position", new BufferAttribute(buffer, 3));
                    let newMaterial = new MeshPhongMaterial({
                        color: m.data.materialColorString,
                        opacity: m.data.materialOpacity,
                        transparent: true,
                        flatShading: true,
                    });
                    const edges = new EdgesGeometry(geometry, 90);
                    const line = new LineSegments(
                        edges,
                        new LineBasicMaterial({ color: "#202020" })
                    );
                    const childMesh = new Mesh(geometry, newMaterial);
                    childMesh.add(line);
                    noneStructuralMesh.add(childMesh);
                    this.viralViewerApi.rerender();
                    break;
                case 2:
                    let buffer2 = m.data.buffer;
                    let instances = m.data.instances;
                    const geometry2 = new BufferGeometry();
                    geometry2.setAttribute(
                        "position",
                        new BufferAttribute(buffer2, 3)
                    );
                    let newMaterial2 = new MeshPhongMaterial({
                        color: m.data.materialColorString,
                        opacity: m.data.materialOpacity,
                        transparent: true,
                        flatShading: true,
                    });
                    for (let index = 0; index < instances.length; index++) {
                        const instance = instances[index];
                        let cloneGeometry2 = geometry2.clone();

                        const childMesh2 = new Mesh(cloneGeometry2, newMaterial2);
                        let numbers = [
                            instance.BasisX.X,
                            -instance.BasisX.Z,
                            -instance.BasisX.Y,
                            0,
                            -instance.BasisZ.X,
                            instance.BasisZ.Z,
                            instance.BasisZ.Y,
                            0,
                            -instance.BasisY.X,
                            instance.BasisY.Z,
                            instance.BasisY.Y,
                            0,
                            -instance.Offset.X,
                            instance.Offset.Z,
                            instance.Offset.Y,
                            1,
                        ];
                        let matrix4 = new Matrix4();
                        matrix4.fromArray(numbers);
                        childMesh2.applyMatrix4(matrix4);
                        const edges = new EdgesGeometry(childMesh2.geometry);
                        const line = new LineSegments(
                            edges,
                            new LineBasicMaterial({ color: "#202020" })
                        );
                        childMesh2.add(line);
                        noneStructuralMesh.add(childMesh2);
                    }
                    // viralViewerApi.rerender();
                    break;
                case 3:
                    console.log('complete');
                    callbackOnSuccess();
                    break;
                default:
                    break;
            }
        };
        this.worker.postMessage({ type: 1, data: model });
    }
}

