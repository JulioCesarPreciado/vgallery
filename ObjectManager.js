import * as THREE from 'three';

export default class ObjectManager {
   constructor(scene) {
      this.scene = scene;
      this.objects = [];
      this.init();
   }

   init() {
      // Agregar el plano
      const geometry = new THREE.PlaneGeometry(40, 40, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x8126B5, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = Math.PI / 2;
      this.scene.add(plane);

      const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xDFBAF5 }); // Color gris para las paredes
      const wallThickness = 0.2; // Elige el grosor que prefieras para las paredes
      const wallHeight = 10; // Elige la altura que prefieras para las paredes

      // Pared superior
      const topWallGeometry = new THREE.BoxGeometry(40 + wallThickness * 2, wallHeight, wallThickness);
      const topWall = new THREE.Mesh(topWallGeometry, wallMaterial);
      topWall.position.z = -5 - wallThickness / 2;
      topWall.position.y = wallHeight / 2
      this.scene.add(topWall);

      // Pared inferior
      const bottomWallGeometry = new THREE.BoxGeometry(40 + wallThickness * 2, wallHeight, wallThickness);
      const bottomWall = new THREE.Mesh(bottomWallGeometry, wallMaterial);
      bottomWall.position.z = 5 + wallThickness / 2;
      bottomWall.position.y = wallHeight / 2
      this.scene.add(bottomWall);

      // Pared izquierda
      const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 10 + wallThickness * 2);
      const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
      leftWall.position.x = -5 - wallThickness / 2;
      this.scene.add(leftWall);

      // Pared derecha
      const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 10 + wallThickness * 2);
      const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
      rightWall.position.x = 5 + wallThickness / 2;
      this.scene.add(rightWall);
   }
}
