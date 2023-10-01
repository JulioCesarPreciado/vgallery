import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export default class Controls {
    constructor(camera, domElement,scene) {
        this.controls = new PointerLockControls(camera, domElement);
        this.scene = scene
        this.init();
    }

    init() {
        const blocker = document.getElementById('blocker');
        const instructions = document.getElementById('instructions');

        instructions.addEventListener('click', () => {
            this.controls.lock();
        });

        this.controls.addEventListener('lock', function () {
            instructions.style.display = 'none';
            blocker.style.display = 'none';

        });

        this.controls.addEventListener('unlock', function () {

            blocker.style.display = 'block';
            instructions.style.display = '';

        });

        this.scene.add(this.controls.getObject());
    }

    getControls() {
        return this.controls;
    }
}