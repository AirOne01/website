<script lang='ts'>
  import gsap from 'gsap';
  import { writable, get } from 'svelte/store';
  import {
    Canvas,
    Scene,
    PerspectiveCamera,
    Mesh,
    DirectionalLight,
    MeshStandardMaterial,
    BoxBufferGeometry,
    WebGLRenderer,
    AmbientLight,
    Vector3,
    MathUtils,
  } from 'svelthree';

  let cubeGeometry = new BoxBufferGeometry(0.1, 0.7, 0.4);
  cubeGeometry.translate(0, 0, 0);
  cubeGeometry.rotateY(MathUtils.degToRad(180));

  let cubeMaterial = new MeshStandardMaterial();

  let oldPos = writable();
  let oldRot = writable();
  let isBig = writable(false);

  const triggerOnClickAni = (e?: CustomEvent<any>) => {
    let obj = e.detail.target;
    oldPos.set(obj.position)
    oldRot.set(obj.rotation)
    isBig.set(true);
    console.log('Changed values: ', get(oldPos), get(oldRot));
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
    console.log(get(oldPos), get(oldRot), get(isBig));
    if (get(isBig)) {
      gsap.to(obj.position, {
        duration: 0.25,
        x: get(oldPos)['x'],
        y: get(oldPos)['y'],
        z: 0,
        ease: 'sine.out',
      });
    } else {
      gsap.to(obj.position, {
        duration: 0.25,
        z: 0,
        ease: 'sine.out',
      });
    }
    gsap.to(obj.rotation, {
      duration: 0.15,
      y: get(oldRot)['y'],
      ease: 'sine.in',
    });
    isBig.set(false);
  };
</script>

<main>
  <Canvas let:sti w={500} h={500} interactive>
    <Scene {sti} let:scene id='scene1' props={{ background: 0xedf2f7 }}>
      <PerspectiveCamera
        {scene}
        id='cam1'
        props={{ position: [0, 0, 3], lookAt: [0, 0, 0] }} />
      <DirectionalLight {scene} props={{ position: [3, 3, 3] }} />
      <AmbientLight {scene} props={{ color: 0xffffff, intensity: 1.25 }} />

      {#each Array(5) as _, i}
        <Mesh
        {scene}
        geometry={cubeGeometry}
        material={cubeMaterial}
        mat={{ roughness: 1, metalness: 0, color: 0xff3e00 }}
        pos={[i*0.1, 0, 0]}
        interact
        onClick={triggerOnClickAni}
        onPointerOver={triggerOnOverAni}
        onPointerLeave={triggerOnOutAni} />
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