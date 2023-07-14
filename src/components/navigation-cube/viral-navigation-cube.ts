import { ViralViewerApi } from "../../viral-viewer-api";
import { CubeCamera } from "./components/cube-camera";
import { CubeRenderer } from "./components/cube-renderer";
import { CubeScene } from "./components/cube-scene";
import { CubeMouse } from "./components/cube.mouse";

export class ViralNavigationCube {
    targetElement: HTMLElement | null = null;
    cubeScene: CubeScene | null = null;
    cubeRenderer: CubeRenderer | null = null;
    cubeCamera: CubeCamera | null = null;
    cubeMouse: CubeMouse | null = null;
    constructor(public viralViewerApi: ViralViewerApi) {
        this.injectCubeWrapperElement();
        this.targetElement = document.getElementById('orientCubeWrapper');
        if (this.targetElement) {
            this.cubeScene = new CubeScene(this);
            this.cubeRenderer = new CubeRenderer(this);
            this.cubeCamera = new CubeCamera(this);
            this.cubeMouse = new CubeMouse(this);
            // this.cubeRenderer.anim();
        }
    }
    private injectCubeWrapperElement() {
        const container = document.getElementById('container');

        if (container) {
            container.innerHTML += `<div style="position: absolute;
                right: 10px;
                top: 10px;
                display: flex;">
                <svg xmlns="http://www.w3.org/2000/svg" style="fill:white;cursor: pointer;" height="20px" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"/></svg>
                        <div id="orientCubeWrapper" style="height:130px;width:130px"></div>
                    </div>`
        }


    }
}