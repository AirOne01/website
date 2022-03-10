<script>
  import {
    Scene,
    MeshStandardMaterial,
    BoxBufferGeometry,
    MathUtils,
    Mesh,
  } from 'svelthree';

  export let i, j;
  export let columns, rows;
  export let scene;
  export let onClick;
  export let onPointerMove;
  export let onPointerOver;
  export let onPointerLeave;

  // actual properties
  export let isBig = false;
  export let oldPos;

  let cubeMaterial = new MeshStandardMaterial();
  const geometry = new BoxBufferGeometry(0.4, 0.7, 0.1);

  const colors = [
    0x581845,
    0x900c3f,
    0xc70039,
    0xff5733,
    0xffc300
  ]
</script>

<Mesh
  {scene}
  {geometry}
  material={cubeMaterial}
  mat={{ roughness: 1, metalness: 0, color: colors[Math.floor(Math.random() * colors.length)] }}
  pos={[(j*0.103)-((columns*0.103)/2), (i*0.75)-((rows*0.75)/3), 0]}
  rot={[0, MathUtils.degToRad(90), 0]}
  interact
  {onClick}
  {onPointerOver}
  {onPointerLeave}
  {onPointerMove}
/>