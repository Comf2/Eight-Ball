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
//Make shake button play animation and give an answer
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
      object.name = 'eightBall';
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

const fontLoader = new FontLoader();
function loadText(text) {}
// ----- Cyclcing Text Effect on Home State ----- //
let performingCycleEffect = true;
function removeCyclingAnswerEffect(geo) {
  scene.remove(geo);
  if (performingCycleEffect) loadCyclingAnswerEffect();
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
// ----- initting events ----- //
const shakeButton = document.querySelector('#shake-button');
shakeButton.onclick = () => startEightBallEvent('shake');

const askButton = document.querySelector('#ask-button');
askButton.onclick = () => startEightBallEvent('ask');

function startEightBallEvent(e) {
  performingCycleEffect = false;
  const homeContainer = document.querySelector('.home-container');
  homeContainer.style.opacity = '0';
  setTimeout(() => {
    homeContainer.style.display = 'none';
  }, 500);

  switch (e) {
    case 'shake':
      initShake();
      break;
    case 'ask':
      initAsk();
      break;
  }
}
const askQuestionContainer = document.querySelector('.ask-question-container');
// --- adding in the form --- //
function initAsk() {
  askQuestionContainer.style.display = 'flex';
  setTimeout(() => {
    askQuestionContainer.style.opacity = '1';
  }, 200);
}

const submitQuestionButton = document.getElementById('submit-question');
submitQuestionButton.onclick = () => initShakeAgain();
// --- doing shake animation --- //
function initShake() {
  console.log(camera.rotation);
  animatingCamera = true;
  shakingEightBall = true;
}

// scene.add(gridHelper, mainSpotLightHelper, supportingSpotLightHelper);

const showSceneButton = document.getElementById('show-scene');
showSceneButton.onclick = () => showScene();

let controls = new OrbitControls(camera, renderer.domElement);
let usingControls = true;

function showScene() {
  controls = new OrbitControls(camera, renderer.domElement);
  usingControls = true;
  const homeContainer = document.querySelector('.home-container');
  homeContainer.style.opacity = '0';
  setTimeout(() => {
    homeContainer.style.display = 'none';
  }, 500);

  const showSceneContainer = document.querySelector('.show-scene-container');
  showSceneContainer.style.display = 'flex';
}
//animation

function animateCamera() {
  if (camera.rotation.x <= 0.28) camera.rotation.x += 0.01;
  else animatingCamera = false;
}

//I apoligize to future me
//does the shake and rising animation of the eight ball

let doingFirstRot = true;
const maxShakes = 3;
let shakeCount = 0;
let eightBallAnimFin = false;

function resetEightBallAnim() {
  doingFirstRot = true;
  shakeCount = 0;
  eightBallAnimFin = false;
  animatingCamera = false;
  shakingEightBall = false;
}

function animateEightBall() {
  const eightBall = scene.getObjectByName('eightBall');
  const animationSpeed = 2;
  const shakeAmount = 0.3;

  if ((eightBall.position.y <= 3.5) & !eightBallAnimFin)
    eightBall.position.y += 0.08;
  else if (doingFirstRot) {
    if (eightBall.rotation.z <= 1.2 * shakeAmount)
      eightBall.rotation.z += 0.05 * animationSpeed;
    if (eightBall.position.x >= -1.3 * shakeAmount)
      eightBall.position.x -= 0.05 * animationSpeed;
    else {
      doingFirstRot = false;
    }
  } else if (!doingFirstRot && shakeCount <= maxShakes) {
    if (eightBall.rotation.z <= -1.2 * shakeAmount)
      eightBall.rotation.z -= 0.05 * animationSpeed;
    if (eightBall.position.x <= 1.5 * shakeAmount)
      eightBall.position.x += 0.05 * animationSpeed;
    else {
      shakeCount++;
      doingFirstRot = true;
    }
  } else {
    eightBall.rotation.z = 0;

    if (eightBall.position.y <= 5 && !eightBallAnimFin) {
      console.log('hi');
      eightBall.position.y += 0.15;
    } else {
      eightBall.position.x = 0;
      eightBall.rotation.set(0, 0, 0);
      eightBallAnimFin = true;
    }
  }
  if (eightBallAnimFin) {
    if (eightBall.position.y > 0) {
      camera.rotation.x -= 0.03;
      eightBall.position.y -= 0.3;
    }
    if (eightBall.position.y < 0) {
      eightBall.position.set(0, 0, 0);
    } else if (eightBallAnimFin && eightBall.position.y === 0) {
      showEightBallAnswer();
      shakingEightBall = false;
    }
  }
}
function showEightBallAnswer() {
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
    tMesh.name = 'eightBallAnswer';

    scene.add(tMesh);
    tMesh.geometry.computeBoundingBox();
    const boundingBox = tMesh.geometry.boundingBox;
    const center = boundingBox.getCenter(new THREE.Vector3());

    tMesh.position.set(0 - center.x, 0.5, 1);
    tMesh.rotation.set(-0.3, 0, 0);
  });
  initTryAgain();
}

// --- Init Try Again Screen --- //
const tryAgainContainer = document.querySelector('.try-again-container');

function initTryAgain() {
  tryAgainContainer.style.opacity = '1';
  tryAgainContainer.style.display = 'flex';
}

//initing try again buttons
const askAgainButton = document.querySelector('#ask-again-button');
const shakeAgainButton = document.querySelector('#shake-again-button');

askAgainButton.onclick = () => window.location.reload();
shakeAgainButton.onclick = () => initShakeAgain();

function initShakeAgain() {
  tryAgainContainer.style.opacity = '0';
  askQuestionContainer.style.opacity = '0';
  setTimeout(() => {
    tryAgainContainer.style.display = 'none';
    askQuestionContainer.style.display = 'none';
  }, 500);

  const answer = scene.getObjectByName('eightBallAnswer');
  removeCyclingAnswerEffect(answer);
  resetEightBallAnim();
  initShake();
}

let animatingCamera = false;
let shakingEightBall = false;
function animate() {
  requestAnimationFrame(animate);
  if (usingControls) {
    controls.update();
  }
  if (animatingCamera) animateCamera();
  if (shakingEightBall) animateEightBall();
  renderer.render(scene, camera);
}

animate();
