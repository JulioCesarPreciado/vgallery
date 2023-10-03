
import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, controls;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function floor(size) {
    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('/static/textures/castor.png');

    // Configura la textura para que se repita
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(100, 100); // Repetir textura 100x100 veces

    const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
    const floorGeometry = new THREE.PlaneGeometry(size, size, 10, 10);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

    floorMesh.rotation.x = - Math.PI / 2;
    return floorMesh;
}

function limitantWalls(size) {
    // Cargar la textura
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load('/static/textures/castor.png'); // Cambia a la URL de tu textura de pared

    // Configura la textura para que se repita si es necesario
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(20, 4); // Ajusta según tus necesidades

    // Crear el material con la textura
    const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });
    const wallGeometry = new THREE.BoxGeometry(1, 200, size); // Ajusta según tus necesidades
    const walls = new THREE.Group();

    // Pared Izquierda
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.set(-(size / 2), 10, 0); // Ajusta según tus necesidades
    walls.add(leftWall);

    // Pared Derecha
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.position.set(size / 2, 10, 0); // Ajusta según tus necesidades
    walls.add(rightWall);

    // Pared Superior
    const topWall = new THREE.Mesh(wallGeometry, wallMaterial);
    topWall.rotation.y = Math.PI / 2; // Rota la pared 90 grados
    topWall.position.set(0, 10, -(size / 2)); // Ajusta según tus necesidades
    walls.add(topWall);

    // Pared Inferior
    const bottomWall = new THREE.Mesh(wallGeometry, wallMaterial);
    bottomWall.rotation.y = Math.PI / 2; // Rota la pared 90 grados
    bottomWall.position.set(0, 10, size / 2); // Ajusta según tus necesidades
    walls.add(bottomWall);

    return walls;
}

function loadObjWithMtl(objPath, mtlPath, position) {
    return new Promise((resolve, reject) => {
        const mtlLoader = new MTLLoader();
        mtlLoader.load(mtlPath, (materials) => {
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(objPath, (object) => {
                object.position.set(position.x, position.y, position.z);
                resolve(object);
            }, undefined, reject);
        }, undefined, reject);
    });
}

function loadGLBModel(path, position, scale = new THREE.Vector3(1, 1, 1)) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                model.position.set(position.x, position.y, position.z);
                model.scale.set(scale.x, scale.y, scale.z);
                resolve(model);
            },
            undefined,
            reject
        );
    });
}

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x76AAFF);
    scene.fog = new THREE.Fog(0x76AAFF, 0, 1000);
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 2.5);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);
    controls = new PointerLockControls(camera, document.body);
    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');
    instructions.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });
    scene.add(controls.getObject());
    /* Constructorores de escenarios */
    /* Floor */
    scene.add(floor(2000))
    /* Paredes limitantes */
    scene.add(limitantWalls(2000))
    /* Amor */
    /*var position = new THREE.Vector3(100, 0, 0);
    var scale = new THREE.Vector3(100, 100, 100);
    loadGLBModel('/static/models/amor.glb', position, scale).then((model) => {
        scene.add(model);
    }).catch((error) => {
        console.error('Error loading GLB model:', error);
    });*/
    /* Amor */
    /*var position = new THREE.Vector3(100, 70, 50);
    var scale = new THREE.Vector3(100, 100, 100);
    loadGLBModel('/static/models/poly.glb', position, scale).then((model) => {
        scene.add(model);
    }).catch((error) => {
        console.error('Error loading GLB model:', error);
    });*/

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
            case 'Space':
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;
        }
    };
    const onKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();

    if (controls.isLocked === true) {
        const delta = (time - prevTime) / 1000;

        // Guarda la posición actual para revertir si se detecta una colisión
        const oldPosition = controls.getObject().position.clone();

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta);

        // Verificación de colisiones
        const wallMargin = 1;
        const wallLimit = 1000 - wallMargin;

        if (controls.getObject().position.x > wallLimit
            || controls.getObject().position.x < -wallLimit
            || controls.getObject().position.z > wallLimit
            || controls.getObject().position.z < -wallLimit) {
            // Si el jugador está fuera de los límites, revierte la posición
            controls.getObject().position.copy(oldPosition);
        }

        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
    }

    prevTime = time;
    renderer.render(scene, camera);
}