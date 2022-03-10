<script>
  import gsap from 'gsap';
  import {
    Canvas,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    WebGLRenderer,
    AmbientLight,
    Vector3,
    MathUtils
  } from 'svelthree';
  import Book from './Book.svelte';

  const onClick = (e) => {
    let obj = e.detail.target;
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

  const onPointerOver = (e) => {
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

  const onPointerLeave = (e) => {
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
        x: 0,
        y: MathUtils.degToRad(90),
        z: 0,
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

  function onPointerMove(e) {
    let obj = e.detail.target;
    if (!obj.isBig) return;

    let unpr = new Vector3().copy(e.detail.unprojected);
    let unprwtl = obj.worldToLocal(unpr).add(new Vector3(0, 0, 6));
    obj.lookAt(unprwtl);
  }

  const rows = 4;
  const columns = 20;

  let innerHeight, innerWidth;
</script>

<svelte:window bind:innerHeight bind:innerWidth/>
<main>
  <Canvas let:sti w={1600} h={900} interactive>
    <Scene {sti} let:scene id='scene1' props={{ background: 0xedf2f7 }}>
      <PerspectiveCamera
        {scene}
        id='cam1'
        props={{ position: [0, 0, 4], lookAt: [0, 0, 0] }}
      />
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
            oldPos={[(j*0.103)-((columns*0.103)/2), (i*0.72)-((rows*0.72)/2), 0]}
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