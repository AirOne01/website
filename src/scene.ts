import gsap from 'gsap';
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Euler,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Scene,
  WebGLRenderer,
  Vector2,
  Vector3,
} from 'three';

import type { Book, BookMesh } from './Book';
import {
  control,
  mouseDown,
  mouseMove,
  mouseUp
} from './controls';

const colors = [
  0x581845,
  0x900c3f,
  0xc70039,
  0xff5733,
  0xffc300
]

let currentBig = null;

const scene = new Scene();
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const geometry = new BoxGeometry(0.4, 0.7, 0.1);
const material = new MeshStandardMaterial({ color: 0x00ff00 });
camera.position.z = 4;
const light1 = new AmbientLight(0xffffff, 0.2);
scene.add(light1);
const light2 = new DirectionalLight(0xffffff, 1);
light2.position.set(0, 0, 2);
scene.add(light2);

let renderer: WebGLRenderer;
const raycaster = new Raycaster();

const mouse = new Vector2();
const previousMousePosition = {
  x: 0,
  y: 0
};
let isDragging = false;

// for having an equal amount of books in rows of the shelf
let number = 80;
let n = 3;
const rows = [];
while (number > 0 && n > 0) {
  const a = Math.ceil(number / n );
  number -= a;
  n--;
  rows.push(a);
}

const books: Book[] = [];
for (let i = 0; i < rows.length; i++) {
  for (let j = 0; j < rows[i]; j++) {
    const mesh = new Mesh(geometry, material);
    mesh.translateX((j*0.103)-((rows[i]*0.103)/2));
    mesh.translateY((i*0.72)-((rows.length*0.72)/3));
    mesh.rotateY(Math.PI/2);
    mesh.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
    scene.add(mesh);

    const obj: Mesh = mesh;
    obj['isBig'] = false;
    obj['oldPos'] = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z };
    books.push({ obj: obj as BookMesh, color: colors[Math.floor(Math.random() * colors.length)] });
  }
}

export const createScene = (el) => {
  renderer = new WebGLRenderer({ antialias: true, canvas: el });
  //controls = new ObjectControls(camera, renderer.domElement, null).enableVerticalRotation();

  resize();
  animate();

  renderer.domElement.addEventListener('click', onClick);
  renderer.domElement.addEventListener('mousemove', onPointerMove);
  renderer.domElement.addEventListener('mousedown', e => {
    mouseDown(e);
    isDragging = true;
  });
  renderer.domElement.addEventListener('mouseup', e => {
    mouseUp();
    isDragging = false;
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

window.addEventListener('resize', resize);

function magicRaycast(e): BookMesh {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  raycaster.params.Points.threshold = 0.1;
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length == 0) return null;

  let inte = null;
  if (intersects.length > 0) inte = intersects[0];

  for (const el of intersects) {
    const zPoint = Math.floor(el.point.z * 1000);
    if (el.distance > inte.distance && zPoint >= 200 && zPoint <= 400 && (el.object as BookMesh).isBig) {
      inte = el;
    }
  }

  return inte.object;
}

function onClick(e) {
  const obj = magicRaycast(e);

  // get mesh
  if (currentBig && obj == currentBig) return;
  leave();
  // unfocus currently shown book
  currentBig = obj;
  if (!currentBig) return; //safety
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

function onPointerMove(e) {
  mouseMove(e);

  const obj = magicRaycast(e);

  if(obj && obj.isBig) {
    control(obj);
  }

  for (const el of books) {
    if (el.obj == obj) continue;
    if (el.obj.isBig) continue;
    gsap.to(el.obj.position, {
      duration: 0.25,
      z: 0,
      ease: 'sine.out',
    });
  }

  // if hovering over a book
  if (obj && !obj.isBig) {
    gsap.to(obj.position, {
      duration: 0.25,
      z: 0.3,
      ease: 'sine.out',
    });
  }
};

function leave() {
  if (!currentBig) return;
  if (currentBig.isBig) {
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
      y: Math.PI/2,
      z: 0,
      ease: 'sine.in',
    });
  }
  currentBig.isBig = false;
  currentBig = null;
};
