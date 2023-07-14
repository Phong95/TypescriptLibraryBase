import { ViralViewerApi } from "viral-viewer-2";

export class TestingViralViewerLib {
    private viralViewerApi: ViralViewerApi | null = null;

    public async loadModel() {
        const container = document.getElementById('container');
        if (container) {
            this.viralViewerApi = new ViralViewerApi({ cameraZUp: false, container: container });
            this.viralViewerApi!.viralAnimation.mainAnimation();
            this.viralViewerApi!.viralAnimation.cubeAnimation();
            if (this.viralViewerApi.worker) {
                let model = await this.viralViewerApi.compressProcessor.decompressed('./public/MarubeniCoffee.json');
                if (model) {
                    this.viralViewerApi.worker.loadModel(model, () => {
                        this.viralViewerApi!.viralCamera.focusModelByName('Viral Model');
                    })
                }

            }
        }
    }
}

let testingViralViewerLib = new TestingViralViewerLib();
await testingViralViewerLib.loadModel();