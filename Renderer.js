import * as THREE from 'three';

export default class Renderer {
   constructor() {
      this.renderer = new THREE.WebGLRenderer();
      this.init();
   }

   init() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
   }

   getRenderer() {
      return this.renderer;
   }
}
