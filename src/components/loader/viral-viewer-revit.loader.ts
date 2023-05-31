import * as THREE from "three";
import { RenderMaterial, RevitTransform, ViralPoint, ViralViewerRevitProject } from "../../types";

export class ViralViewerRevitLoader {
    scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        if (scene) {
            this.scene = scene;
        }
    }
    public loadRevit(model: ViralViewerRevitProject) {
        this.progressNoneStructuralGeometries(model);
        this.progressStructuralGeometries(model);
    }
    private progressStructuralGeometries(model: ViralViewerRevitProject) {
        const modelMesh = new THREE.Mesh();
        for (let index = 0; index < model.StructuralGeometries.length; index++) {
            // if(index==0) continue;
            const geometry = model.StructuralGeometries[index];
            const material = model.Materials[geometry.MaterialIndex];

            this.addCustomMesh3(modelMesh, geometry.Indices, geometry.Vertices, material);
        }
        modelMesh.castShadow = true;
        modelMesh.receiveShadow = true;
        this.scene.add(modelMesh);
    }
    private progressNoneStructuralGeometries(model: ViralViewerRevitProject) {
        const modelMesh = new THREE.Mesh();
        modelMesh.castShadow = true;
        modelMesh.receiveShadow = true;
        for (let index = 0; index < model.NoneStructuralGeometries.length; index++) {
            const geometry = model.NoneStructuralGeometries[index];
            const material = model.Materials[geometry.MaterialIndex];
            this.addCustomMesh4(
                modelMesh,
                geometry.Indices,
                geometry.Vertices,
                material,
                geometry.Instances
            );
        }
        this.scene.add(modelMesh);
    }
    private addCustomMesh3(mesh: THREE.Mesh, indices: number[], vertices: ViralPoint[], material: RenderMaterial) {

        const geometry = new THREE.BufferGeometry();
        let verticePoints = [];
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];
            const point = vertices[index];
            verticePoints.push(-point.X);
            verticePoints.push(point.Z);
            verticePoints.push(point.Y);
        }
        const buffer = new Float32Array(verticePoints);
        let colorString: any = this.rgbToHex(material.Red, material.Green, material.Blue);
        geometry.setAttribute("position", new THREE.BufferAttribute(buffer, 3));
        let newMaterial = new THREE.MeshPhongMaterial({
            color: colorString,
            opacity: material.Opacity,
            transparent: true,
            flatShading: true,
        });
        const edges = new THREE.EdgesGeometry(geometry, 90);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: "#202020" })
        );
        const childMesh = new THREE.Mesh(geometry, newMaterial);
        childMesh.castShadow = true;
        childMesh.receiveShadow = true;
        childMesh.add(line);
        mesh.add(childMesh);
    }
    private addCustomMesh4(mesh: THREE.Mesh, indices: number[], vertices: ViralPoint[], material: RenderMaterial, instances: RevitTransform[]) {
        const geometry = new THREE.BufferGeometry();
        let verticePoints = [];
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];
            const point = vertices[index];
            verticePoints.push(-point.X);
            verticePoints.push(point.Z);
            verticePoints.push(point.Y);
        }
        const buffer = new Float32Array(verticePoints);
        let colorString: any = this.rgbToHex(material.Red, material.Green, material.Blue);
        geometry.setAttribute("position", new THREE.BufferAttribute(buffer, 3));
        let newMaterial = new THREE.MeshPhongMaterial({
            color: colorString,
            opacity: material.Opacity,
            transparent: true,
            flatShading: true
        });

        for (let index = 0; index < instances.length; index++) {
            const instance = instances[index];
            let cloneGeometry = geometry.clone();

            const childMesh = new THREE.Mesh(cloneGeometry, newMaterial);
            childMesh.castShadow = true;
            childMesh.receiveShadow = true;
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
            let matrix4 = new THREE.Matrix4();
            matrix4.fromArray(numbers);
            childMesh.applyMatrix4(matrix4);
            const edges = new THREE.EdgesGeometry(childMesh.geometry);
            const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({ color: "#202020" })
            );
            childMesh.add(line);
            mesh.add(childMesh);
        }
    }
    private rgbToHex(r:number, g:number, b:number) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    private componentToHex(c:number) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}