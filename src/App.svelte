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
Geometry
  } from 'svelthree';

  let cubeGeometry = new BoxBufferGeometry(0.1, 0.7, 0.4);
  cubeGeometry.translate(0, 0, 0);
  cubeGeometry.rotateY(MathUtils.degToRad(180));

  let cubeMaterial = new MeshStandardMaterial();

  let oldPos = writable();
  let isBig = writable(false);

  const triggerOnClickAni = (e?: CustomEvent<any>) => {
    let obj = e.detail.target;
    oldPos.set(obj.position)
    isBig.set(true);
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

  const triggerOnOverAni = (e?: CustomEvent<any>) => {
    let obj = e.detail.target;
    gsap.to(obj.position, {
      duration: 0.25,
      z: 0.3,
      ease: 'sine.out',
    });
  };

  const triggerOnOutAni = (e?: CustomEvent<any>) => {
    let obj = e.detail.target;
    if (get(isBig)) {
      gsap.to(obj.position, {
        duration: 0.25,
        x: get(oldPos)['x'],
        y: get(oldPos)['y'],
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
    isBig.set(false);
  };

  export const rows = 3;
  export const columns = 20;
</script>

<main>
  <Canvas let:sti w={500} h={500} interactive>
    <Scene {sti} let:scene id='scene1' props={{ background: 0xedf2f7 }}>
      <PerspectiveCamera
        {scene}
        id='cam1'
        props={{ position: [0, 0, 3], lookAt: [0, 0, 0] }} />
      <DirectionalLight {scene} props={{ position: [3, 3, 3], intensity: 0.5 }} />
      <AmbientLight {scene} props={{ color: 0xffffff, intensity: 0.5 }} />

      {#each Array(rows) as _, i}
        {#each Array(columns) as _, j}
          <Mesh
            {scene}
            geometry={cubeGeometry}
            material={cubeMaterial}
            mat={{ roughness: 1, metalness: 0, color: Math.random() * 0xffffff }}
            pos={[(j*0.103)-((columns*0.103)/2), (i*0.75)-((rows*0.75)/2)+0.5, 0]}
            interact
            onClick={triggerOnClickAni}
            onPointerOver={triggerOnOverAni}
            onPointerLeave={triggerOnOutAni}
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