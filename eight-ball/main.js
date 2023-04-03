import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import { eightBallAnswers } from './public/js/eight-ball-data';
import { getRandomInt } from './public/js/utility-functions';
//project init

//---TODO: make a button that will turn on controls so you can see the whole scene --//

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
const starsTexture = new THREE.TextureLoader().load('./skybox/stars.png');
scene.background = starsTexture;
//init models

const mtlLoader = new MTLLoader();

//eight ball
mtlLoader.load('./models/eight-ball.mtl', (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('./models/materials/eight-ball-color.png');
  objLoader.load(
    './models/eight-ball.obj',
    (object) => {
      object.children.forEach((child) => {
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
  const texture = textureLoader.load('./models/materials/wood-texture.png');
  objLoader.load(
    './models/eight-ball-base.obj',
    (object) => {
      object.children.forEach((child) => {
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
//this isnt working lol
//table
mtlLoader.load('./models/table.mtl', (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('./models/materials/wood-texture.png');
  objLoader.load(
    './models/table.obj',
    (object) => {
      object.children.forEach((child) => {
        if (child.isMesh) {
          child.material.map = texture;
        }
      });
      object.receiveShadow = true;
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
  const texture = textureLoader.load('./models/materials/brick.jpg');
  objLoader.load(
    './models/floor.obj',
    (object) => {
      object.children.forEach((child) => {
        if (child.isMesh) {
          child.material.map = texture;
        }
      });
      object.receiveShadow = true;

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
  const texture = textureLoader.load('./models/materials/wall-texture.png');
  objLoader.load(
    './models/walls.obj',
    (object) => {
      object.children.forEach((child) => {
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

// ------- Text ------- //

//remove text, add new text, from array
//push object to global array, remove object, clear it
const fontLoader = new FontLoader();

// ----- Cyclcing Text Effect on Home State ----- //

function removeCyclingAnswerEffect(geo) {
  console.log('geo :>> ', geo);
  scene.remove(geo);

  loadCyclingAnswerEffect();
}

function loadCyclingAnswerEffect() {
  const currentText = eightBallAnswers[getRandomInt(eightBallAnswers.length)];

  fontLoader.load('/fonts/Quite Magical_Regular.json', (font) => {
    const textSize = 200; //higher it is the smaller the text
    const geometry = new TextGeometry(currentText, {
      font: font,
      size: 80 / textSize,
      height: 5 / textSize,
      curveSegments: 12 / textSize,
      bevelEnabled: true,
      bevelThickness: 10 / textSize,
      bevelSize: 8 / textSize,
      bevelOffset: 0 / textSize,
      bevelSegments: 5,
    });
    geometry.castShadow = true;
    geometry.revieveShadow = true;

    const tMesh = new THREE.Mesh(geometry, [
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
    ]);
    scene.add(tMesh);
    tMesh.geometry.computeBoundingBox();
    const boundingBox = tMesh.geometry.boundingBox;
    const center = boundingBox.getCenter(new THREE.Vector3());

    console.log('eightBallAnswers :>> ', eightBallAnswers);
    tMesh.position.set(0 - center.x, 0.5, 1);
    tMesh.rotation.set(-0.3, 0, 0);

    //removing cycle
    setTimeout(() => {
      removeCyclingAnswerEffect(tMesh);
    }, 200);
  });
} //end of function
loadCyclingAnswerEffect();
//cameras
camera.position.set(0, 1.9, 4.85);
camera.lookAt(0, 0, 0);

//lighting

const directionalLight = new THREE.DirectionalLight(0xc98200, 0.5);

const ambientLight = new THREE.AmbientLight(0xffffff);

const mainSpotLight = new THREE.SpotLight(0xffa500, 1);
mainSpotLight.position.set(0, 5, -3);
mainSpotLight.castShadow = true;

const supportingSpotLight = new THREE.SpotLight(0xffa500, 1);
supportingSpotLight.position.set(0, -2, 6);
supportingSpotLight.castShadow = true;

scene.add(mainSpotLight, supportingSpotLight, directionalLight);

//helpers
const gridHelper = new THREE.GridHelper(200, 50);

const mainSpotLightHelper = new THREE.SpotLightHelper(mainSpotLight);
const supportingSpotLightHelper = new THREE.SpotLightHelper(
  supportingSpotLight
);

// scene.add(gridHelper, mainSpotLightHelper, supportingSpotLightHelper);

const controls = new OrbitControls(camera, renderer.domElement);
let usingControls = true;

//animation
function animate() {
  requestAnimationFrame(animate);
  if (usingControls) {
    controls.update();
  }
  renderer.render(scene, camera);
}

animate();
