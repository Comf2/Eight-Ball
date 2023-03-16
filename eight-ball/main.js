import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
//project init

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	canvas: document.querySelector('#main-scene'),
});
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);

//setting skybox
const starsTexture = new THREE.TextureLoader().load(
	'./skybox/stars.png'
);
scene.background = starsTexture;
//init models

const mtlLoader = new MTLLoader();

//eight ball
mtlLoader.load('./models/eight-ball.mtl', (materials) => {
	materials.preload();

	const objLoader = new OBJLoader();
	objLoader.setMaterials(materials);
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(
		'./models/materials/eight-ball-color.png'
	);
	objLoader.load(
		'./models/eight-ball.obj',
		(object) => {
			object.children.forEach((child) => {
				console.log(child.isMesh);
				if (child.isMesh) {
					child.material.map = texture;
				}
			});
			scene.add(object);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		},
		(error) => {
			console.error(error);
		}
	);
});

//eight ball base
mtlLoader.load('./models/eight-ball-base.mtl', (materials) => {
	materials.preload();

	const objLoader = new OBJLoader();
	objLoader.setMaterials(materials);
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(
		'./models/materials/wood-texture.png'
	);
	objLoader.load(
		'./models/eight-ball-base.obj',
		(object) => {
			object.children.forEach((child) => {
				console.log(child.isMesh);
				if (child.isMesh) {
					child.material.map = texture;
				}
			});
			scene.add(object);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		},
		(error) => {
			console.error(error);
		}
	);
});
//table
mtlLoader.load('./models/table.mtl', (materials) => {
	materials.preload();

	const objLoader = new OBJLoader();
	objLoader.setMaterials(materials);
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(
		'./models/materials/wood-texture.png'
	);
	objLoader.load(
		'./models/table.obj',
		(object) => {
			object.children.forEach((child) => {
				console.log(child.isMesh);
				if (child.isMesh) {
					child.material.map = texture;
				}
			});
			scene.add(object);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		},
		(error) => {
			console.error(error);
		}
	);
});
//floor
mtlLoader.load('./models/table.mtl', (materials) => {
	materials.preload();

	const objLoader = new OBJLoader();
	objLoader.setMaterials(materials);
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(
		'./models/materials/brick.jpg'
	);
	objLoader.load(
		'./models/floor.obj',
		(object) => {
			object.children.forEach((child) => {
				console.log(child.isMesh);
				if (child.isMesh) {
					child.material.map = texture;
				}
			});
			scene.add(object);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		},
		(error) => {
			console.error(error);
		}
	);
});

//wall
mtlLoader.load('./models/table.mtl', (materials) => {
	materials.preload();

	const objLoader = new OBJLoader();
	objLoader.setMaterials(materials);
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(
		'./models/materials/wall-texture.png'
	);
	objLoader.load(
		'./models/walls.obj',
		(object) => {
			object.children.forEach((child) => {
				console.log(child.isMesh);
				if (child.isMesh) {
					child.material.map = texture;
				}
			});
			scene.add(object);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		},
		(error) => {
			console.error(error);
		}
	);
});



//cameras
camera.position.z = 30;

//lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

//helpers
const pointLightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(pointLightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
//animation
function animate() {
	requestAnimationFrame(animate);

	controls.update();

	renderer.render(scene, camera);
}

animate();

//basic responsiveness
window.addEventListener('resize', function (e) {
	console.log(window.innerWidth);
	if (window.innerWidth <= 700) {
		window.location.reload();
	}
});
