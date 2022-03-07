<script lang="ts">
  import {
    Canvas,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    MeshStandardMaterial,
    BoxBufferGeometry,
    WebGLRenderer,
    AmbientLight,
    MathUtils,
    Mesh,
    Vector3,
  } from 'svelthree';

  export let i: number, j: number;
  export let columns: number, rows: number;
  export let scene: Scene;
  export let onClick: () => void;
  export let onPointerMove: (e?: CustomEvent<any>) => void;
  export let onPointerOver: (e?: CustomEvent<any>) => void;
  export let onPointerLeave: (e?: CustomEvent<any>) => void;

  // actual properties
  export let isBig = false;
  export let oldPos: { x: number, y: number, z: number };

  let cubeMaterial = new MeshStandardMaterial();
  const geometry = new BoxBufferGeometry(0.1, 0.7, 0.4);
  geometry.translate(0, 0, 0);
  geometry.rotateY(MathUtils.degToRad(180));
</script>

<Mesh
  {scene}
  {geometry}
  material={cubeMaterial}
  mat={{ roughness: 1, metalness: 0, color: Math.random() * 0xffffff }}
  pos={[(j*0.103)-((columns*0.103)/2), (i*0.75)-((rows*0.75)/2)+0.5, 0]}
  interact
  {onClick}
  {onPointerOver}
  {onPointerLeave}
  {onPointerMove}
/>