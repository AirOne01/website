import gsap from 'gsap';
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  FontLoader,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  TextGeometry,
  WebGLRenderer,
  Vector2,
  Vector3,
} from 'three';

const rows = 4;
const columns = 20;
const colors = [
  0x581845,
  0x900c3f,
  0xc70039,
  0xff5733,
  0xffc300
]

let currentBig = null;

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
let renderer;
scene.add(cube);
camera.position.z = 5;

const animate = () => {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
};

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

export const createScene = (el) => {
  renderer = new WebGLRenderer({ antialias: true, canvas: el });
  resize();
  animate();
}

window.addEventListener('resize', resize);

function onClick(e) {
  let obj = e.detail.target;
  // get mesh
  if (currentBig && obj == currentBig) return;
  leave();
  // unfocus currently shown book
  currentBig = obj;
  obj.isBig = true;
  obj.oldPos = {x: obj.position.x, y: obj.position.y, z: obj.position.z};

  gsap.to(obj.position, {
    duration: 0.25,
    x: 0,
    y: 0,
    z: 2,
    ease: 'sine.out',
  });
  gsap.to(obj.rotation, {
    duration: 0.20,
    y: 0,
    ease: 'power1.in',
  });
};

function onPointerOver(e) {
  let obj = e.detail.target;
  if (!obj.isBig) {
    let obj = e.detail.target;
    gsap.to(obj.position, {
      duration: 0.25,
      z: 0.3,
      ease: 'sine.out',
    });
  }
};

function onPointerLeave(e) {
  let obj = e.detail.target;
  if (!obj.isBig) {
    gsap.to(obj.position, {
      duration: 0.25,
      z: 0,
      ease: 'sine.out',
    });
  }
}

function leave() {
  if (!currentBig) return;
  if (currentBig.isBig) {
    console.log(currentBig.oldPos);
    gsap.to(currentBig.position, {
      duration: 0.25,
      x: currentBig.oldPos.x,
      y: currentBig.oldPos.y,
      z: 0,
      ease: 'sine.out',
    });
    gsap.to(currentBig.rotation, {
      duration: 0.15,
      x: 0,
      y: MathUtils.degToRad(90),
      z: 0,
      ease: 'sine.in',
    });
  }
  currentBig.isBig = false;
  currentBig = null;
};
