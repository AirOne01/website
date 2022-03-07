<script lang='ts'>
  import gsap from 'gsap';
  import { writable, get } from 'svelte/store';
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
Geometry,
  } from 'svelthree';
  import Book from './Book.svelte';

  const onClick = (e?: CustomEvent<any>) => {
    let obj = e.detail.target;
    obj.isBig = true;
    obj.oldPos = {x: obj.position.x, y: obj.position.y, z: obj.position.z};
    gsap.to(obj.position, {
      duration: 0.25,
      x: 0,
      z: 2,
      y: 0,
      ease: 'sine.out',
    });
    gsap.to(obj.rotation, {
      duration: 0.20,
      y: 1.55,
      ease: 'power1.in',
    });
  };

  const onPointerOver = (e?: CustomEvent<any>) => {
    let obj = e.detail.target;
    if (obj.isBig) {
      let obj = e.detail.target;
      gsap.to(obj.position, {
        duration: 0.25,
        z: 0.3,
        ease: 'sine.out',
      });
    }
  };

  const onPointerLeave = (e?: CustomEvent<any>) => {
    let obj = e.detail.target;
    if (obj.isBig) {
      console.log(obj.oldPos);
      gsap.to(obj.position, {
        duration: 0.25,
        x: obj.oldPos.x,
        y: obj.oldPos.y,
        z: 0,
        ease: 'sine.out',
      });
      gsap.to(obj.rotation, {
        duration: 0.15,
        y: 0,
        ease: 'sine.in',
      });
    } else {
      gsap.to(obj.position, {
        duration: 0.25,
        z: 0,
        ease: 'sine.out',
      });
    }
    obj.isBig = false;
  };

  function onPointerMove(e?: CustomEvent<any>) {
    let obj = e.detail.target;

    let unpr = new Vector3().copy(e.detail.unprojected);
    let unprwtl = obj.worldToLocal(unpr).add(new Vector3(0, 0, 1));
    obj.lookAt(unprwtl);
  }

  export const rows = 3;
  export const columns = 20;

  let innerHeight: number;
  let innerWidth: number;
</script>

<svelte:window bind:innerHeight bind:innerWidth/>
<main>
  <Canvas let:sti w={innerWidth} h={innerHeight} interactive>
    <Scene {sti} let:scene id='scene1' props={{ background: 0xedf2f7 }}>
      <PerspectiveCamera
        {scene}
        id='cam1'
        props={{ position: [0, 0, 3], lookAt: [0, 0, 0] }} />
      <DirectionalLight {scene} props={{ position: [3, 3, 3], intensity: 0.5 }} />
      <AmbientLight {scene} props={{ color: 0xffffff, intensity: 0.5 }} />

      {#each Array(rows) as _, i}
        {#each Array(columns) as _, j}
          <Book
            {scene}
            {i}
            {j}
            {rows}
            {columns}
            {onClick}
            {onPointerMove}
            {onPointerLeave}
            {onPointerOver}
          />
        {/each}
      {/each}
    </Scene>

    <WebGLRenderer
      {sti}
      sceneId='scene1'
      camId='cam1'
      config={{ antialias: true, alpha: false }} />
  </Canvas>
</main>

<style lang='scss'>
  :global(body) {
    background: black;
  }
</style>