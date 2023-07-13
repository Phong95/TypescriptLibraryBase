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
    public async loadModel() {
        const container = document.getElementById('container');
        if (container) {
            let viralViewerApi = new ViralViewerApi({ cameraZUp: false, container: container });
            console.log(viralViewerApi)

            viralViewerApi.viralRenderer.anim();
            if (viralViewerApi.worker) {
                let model = await viralViewerApi.compressProcessor.decompressed('./public/Cofico_Office-FM-220829.json');
                if (model) {
                    viralViewerApi.worker.loadModel(model, () => {
                        viralViewerApi.viralCamera.focusModelByName('Viral Model')
                    })
                }

            }
        }
    }
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
