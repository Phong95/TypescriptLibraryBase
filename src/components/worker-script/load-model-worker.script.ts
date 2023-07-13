
function addCustomMesh3(indices: number[], vertices: ViralPoint[], material: RenderMaterial, callback = (buffer: Float32Array, colorString: string, opacity: number) => { }) {
    let verticePoints = [];
    for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        const point = vertices[index];
        verticePoints.push(-point.X);
        verticePoints.push(point.Z);
        verticePoints.push(point.Y);
    }
    const buffer = new Float32Array(verticePoints);
    let colorString = rgbToHex(material.Red, material.Green, material.Blue);

    callback(buffer, colorString, material.Opacity);
}
function addCustomMesh4(indices: number[], vertices: ViralPoint[], material: RenderMaterial, instances: RevitTransform[], callback = (buffer: Float32Array, colorString: string, opacity: number) => { }) {
    let colorString = rgbToHex(material.Red, material.Green, material.Blue);
    let finalVerticePoints: number[] = [];
    for (let index = 0; index < instances.length; index++) {
        const instance = instances[index];

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
        let newVertices = [];
        for (let i = 0; i < vertices.length; i++) {
            const point = vertices[i];
            const point2 = new Vector3(-point.X, point.Z, point.Y);
            point2.applyMatrix4(matrix4);
            newVertices.push(point2);
        }
        let verticePoints = [];
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];
            const point = newVertices[index];
            verticePoints.push(point.x);
            verticePoints.push(point.y);
            verticePoints.push(point.z);
        }
        finalVerticePoints = finalVerticePoints.concat(verticePoints);
    }
    const buffer = new Float32Array(finalVerticePoints);
    callback(buffer, colorString, material.Opacity);
}
function progressStructuralGeometries(json: ViralViewerRevitProject, callback = (buffer: Float32Array, colorString: string, opacity: number) => { }) {
    for (let index = 0; index < json.StructuralGeometries.length; index++) {
        const geometry = json.StructuralGeometries[index];
        const material = json.Materials[geometry.MaterialIndex];

        addCustomMesh3(
            geometry.Indices,
            geometry.Vertices,
            material,
            (buffer, colorString, opacity) => {
                callback(buffer, colorString, opacity);
            }
        );
    }
}
function progressNoneStructuralGeometries(json: ViralViewerRevitProject, callback = (buffer: Float32Array, colorString: string, opacity: number) => { }) {
    for (let index = 0; index < json.NoneStructuralGeometries.length; index++) {
        const geometry = json.NoneStructuralGeometries[index];
        const material = json.Materials[geometry.MaterialIndex];
        addCustomMesh4(
            geometry.Indices,
            geometry.Vertices,
            material,
            geometry.Instances,
            (buffer, colorString, opacity) => {
                callback(buffer, colorString, opacity);
            }
        );
    }
}
function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
self.addEventListener(
    "message",
    async function (e) {
        switch (e.data.type) {
            case 1:
                progressStructuralGeometries(
                    e.data.data,
                    (buffer, colorString, opacity) => {
                        self.postMessage({
                            type: 1,
                            buffer: buffer,
                            materialColorString: colorString,
                            materialOpacity: opacity,
                        });
                    }
                );
                progressNoneStructuralGeometries(
                    e.data.data,
                    (buffer, colorString, opacity) => {
                        self.postMessage({
                            type: 1,
                            buffer: buffer,
                            materialColorString: colorString,
                            materialOpacity: opacity,
                            // instances:instances
                        });
                    }
                );
                self.postMessage({
                    type: 3,
                });
                break;
            default:
                break;
        }
    },
    false
);


interface ViewerOptions {
    container: HTMLElement;
    cameraZUp: boolean;
}
interface ViralViewerRevitProject {
    Materials: RenderMaterial[];
    StructuralGeometries: ViralViewerRevitStructuralGeometry[];
    NoneStructuralGeometries: ViralViewerRevitNoneStructuralGeometry[]
}

interface RenderMaterial {
    Name: String;
    Opacity: number;
    Metalness: number;
    Roughness: number;
    Red: number;
    Green: number;
    Blue: number;
}
interface ViralViewerRevitStructuralGeometry {
    MaterialIndex: number;
    Vertices: ViralPoint[];
    Indices: number[];
}
interface ViralViewerRevitNoneStructuralGeometry {
    MaterialIndex: number;
    Vertices: ViralPoint[];
    Indices: number[];
    Name: string;
    Instances: RevitTransform[];
}
interface ViralPoint {
    X: number;
    Y: number;
    Z: number;
}
interface RevitTransform {
    BasisX: ViralPoint;
    BasisY: ViralPoint;
    BasisZ: ViralPoint;
    Offset: ViralPoint;
}

class Matrix4 {
    public elements: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    constructor() {
    }
    fromArray(array: number[], offset = 0) {
        for (let i = 0; i < 16; i++) {
            this.elements[i] = array[i + offset];
        }

        return this;
    }
}

class Vector3 {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    applyMatrix4(m: Matrix4) {
        const x = this.x,
            y = this.y,
            z = this.z;
        const e = m.elements;

        const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

        return this;
    }
}