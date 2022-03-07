<script lang='ts'>
  import {
    type Scene,
    Mesh,
    type MeshStandardMaterial,
    type BoxBufferGeometry,
    Vector3
  } from 'svelthree';

  export let scene: Scene;
  export let cubeGeometry: BoxBufferGeometry;
  export let cubeMaterial: MeshStandardMaterial;
  export let i: number;
  export let j: number;
  export let columns: number;
  export let rows: number;
  export let triggerOnClickAni: (e?: CustomEvent<any>) => void;
  export let triggerOnOverAni: (e?: CustomEvent<any>) => void;
  export let triggerOnOutAni: (e?: CustomEvent<any>) => void;
  console.log(i, j);

  const pos = new Vector3((j*0.1)-((columns*0.1)/2), (i*0.75)-((rows*0.75)/2)+0.5, 0);
  export const oldPos = pos;
</script>

<Mesh
  {scene}
  geometry={cubeGeometry}
  material={cubeMaterial}
  mat={{ roughness: 1, metalness: 0, color: Math.random() * 0xffffff }}
  {pos}
  interact
  onClick={triggerOnClickAni}
  onPointerOver={triggerOnOverAni}
  onPointerLeave={triggerOnOutAni}
/>