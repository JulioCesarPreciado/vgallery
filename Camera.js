import * as THREE from 'three';

export default class Camera {
   constructor() {
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.init();
   }

   init() {
      this.camera.position.y = 10;
      this.camera.position.z = 20;
      this.camera.lookAt(0, 0, 0);
   }

   getCamera() {
      return this.camera;
   }
}
