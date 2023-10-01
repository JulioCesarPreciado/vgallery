import * as THREE from 'three';
import Camera from './Camera.js';
import Scene from './Scene.js';
import Controls from './Controls.js';
import Renderer from './Renderer.js';
import ObjectManager from './ObjectManager.js';

const camera = new Camera();
const scene = new Scene();
const renderer = new Renderer();
const controls = new Controls(camera.getCamera(), renderer.getRenderer().domElement,scene.getScene());
const objectManager = new ObjectManager(scene.getScene());

function animate() {
   renderer.getRenderer().render(scene.getScene(), camera.getCamera());
   requestAnimationFrame(animate);
}

animate();