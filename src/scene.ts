import gsap from 'gsap';
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  FontLoader,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  TextGeometry,
  WebGLRenderer,
  Vector2,
  Vector3,
} from 'three';

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
const cube = new Mesh(geometry, material);
scene.add(cube);
camera.position.z = 4;
const light1 = new AmbientLight(0xffffff, 0.2);
scene.add(light1);
const light2 = new DirectionalLight(0xffffff, 1);
light2.position.set(0, 0, 2);
scene.add(light2);

let renderer: WebGLRenderer;
const raycaster = new Raycaster();

// for having an equal amount of books in the shelves
let number = 80;
let n = 3;
const rows = [];
while (number > 0 && n > 0) {
  const a = Math.ceil(number / n );
  number -= a;
  n--;
  rows.push(a);
}

const books: { obj: Mesh, color: number, oldPos: Vector3 }[] = [];
for (let i = 0; i < rows.length; i++) {
  for (let j = 0; j < rows[i]; j++) {
    const mesh = new Mesh(geometry, material);
    mesh.translateX((j*0.103)-((rows[i]*0.103)/2));
    mesh.translateY((i*0.72)-((rows.length*0.72)/3));
    mesh.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
    scene.add(mesh);

    books.push({obj: mesh, color: colors[Math.floor(Math.random() * colors.length)], oldPos: {x: mesh.position.x, y: mesh.position.y, z: mesh.position.z}});
  }
}

const animate = () => {
  requestAnimationFrame(animate);
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

  renderer.domElement.addEventListener('click', onClick);
  renderer.domElement.addEventListener('mousemove', onPointerMove);
}

window.addEventListener('resize', resize);

function magicRaycast(): Mesh {
  const mouse = new Vector2();
  raycaster.setFromCamera(mouse, camera);
  raycaster.params.Points.threshold = 0.1;
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length == 0) return null;
  console.log(intersects);
  return intersects[0].object;
}

function onClick() {
  const obj = magicRaycast();

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

function onPointerMove() {
  const obj = magicRaycast();
  if (!obj) return;

  if (!obj.isBig) {
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
