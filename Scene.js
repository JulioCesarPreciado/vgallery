import * as THREE from 'three';

export default class Scene {
   constructor() {
      this.scene = new THREE.Scene();
   }

   add(object) {
      this.scene.add(object);
   }

   getScene() {
      return this.scene;
   }
}
