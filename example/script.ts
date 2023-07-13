import * as THREE from 'three';
import { ViralViewerApi } from 'viral-viewer-2';
export class CubeNavigation {
    constructor(public container: HTMLElement) {

    }
    public injectCubeWrapperElement() {
        if (this.container) {
            this.container.innerHTML += `<div style="position: absolute;
                right: 10px;
                top: 10px;
                display: flex;">
                        <span class="material-symbols-outlined" style="color:white">
                    home
                    </span>
                        <div id="orientCubeWrapper" style="height:130px;width:130px"></div>
                    </div>`
        }
    }
}
export class TestingViralViewerLib {
    private viralViewerApi: ViralViewerApi | null = null;
    public async loadModel() {
        const container = document.getElementById('container');
        if (container) {
            this.viralViewerApi = new ViralViewerApi({ cameraZUp: false, container: container });
            console.log(this.viralViewerApi)

            this.viralViewerApi.viralRenderer.anim();
            if (this.viralViewerApi.worker) {
                // let model = await this.viralViewerApi.compressProcessor.decompressed('./public/Cofico_Office-FM-220829.json');
                let model = await this.viralViewerApi.compressProcessor.decompressed('./public/MarubeniCoffee.json');
                if (model) {
                    this.viralViewerApi.worker.loadModel(model, () => {
                        this.viralViewerApi!.viralCamera.focusModelByName('Viral Model')
                    })
                    container!.onmousedown = this.handleClick;
                }

            }
        }
    }

    private handleClick = async (_event: Event) => {
        if (this.viralViewerApi) {
            let result = this.viralViewerApi.viralCamera.clientToWorld();
            if (result && result.length > 0) {
                const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
                const sphereMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    transparent: true,
                    opacity: 0.5
                });
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.copy(result[0].point);
                sphere.name = "Viral Pivot Point"
                this.viralViewerApi.viralScene.addObject(sphere);
                this.viralViewerApi.viralRenderer.render();
                this.viralViewerApi.viralCamera.camera?.updateMatrixWorld();
                // this.viralViewerApi.viralCamera.camera?.lookAt(result[0].point)
                this.viralViewerApi.viralCamera.cameraControls?.setOrbitPoint(result[0].point.x, result[0].point.y, result[0].point.z)
                // let cameraPosition = new THREE.Vector3();
                // this.viralViewerApi.viralCamera.cameraControls?.getPosition(cameraPosition);
                // this.viralViewerApi.viralCamera.cameraControls?.setLookAt(cameraPosition.x, cameraPosition.y, cameraPosition.z, result[0].point.x, result[0].point.y, result[0].point.z, false)
            }
        }
    };

}
// console.log('hello world')
// const container = document.getElementById('container');
// console.log(container)
// if (container) {
//     let cubeNavigation = new CubeNavigation(container);
//     cubeNavigation.injectCubeWrapperElement();
// }
let testingViralViewerLib = new TestingViralViewerLib();
testingViralViewerLib.loadModel();
