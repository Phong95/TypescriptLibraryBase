
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
console.log('hello world')
const container = document.getElementById('container');
console.log(container)
if (container) {
    let cubeNavigation = new CubeNavigation(container);
    cubeNavigation.injectCubeWrapperElement();
}

