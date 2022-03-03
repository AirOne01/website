<script>
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
  import gsap from "gsap";

  let cubeGeometry = new BoxBufferGeometry(0.8, 0.8, 0.8);
  cubeGeometry.translate(0, 0, 0);
  cubeGeometry.rotateY(MathUtils.degToRad(180));

  let cubeMaterial = new MeshStandardMaterial();

  /**
   * Pointer events can be dispatched twice, so you can separate interactive mesh-animation from other logic happening on e.g. click
   * for example on:click={doFoo} & onClick={doBar}
   */

  function handleOnClick(e) {
    console.log('Triggered !');
  }

  const triggerOnClickAni = (e) => {
    let obj = e.detail.target;
    gsap.to(obj.scale, {
      duration: 0.25,
      x: 1.5,
      y: 1.5,
      z: 1.5,
      ease: 'sine.out',
    });
  };

  const triggerOnOverAni = (e) => {
    let obj = e.detail.target;
    gsap.to(obj.scale, {
      duration: 0.25,
      x: 0.8,
      y: 1.25,
      z: 0.8,
      ease: 'sine.out',
    });
  };

  const triggerOnOutAni = (e) => {
    let obj = e.detail.target;
    gsap.to(obj.scale, { duration: 0.5, x: 1, y: 1, z: 1, ease: 'sine.out' });
  };
</script>

<Canvas let:sti w={500} h={500} interactive>
  <Scene {sti} let:scene id='scene1' props={{ background: 0xedf2f7 }}>
    <PerspectiveCamera
      {scene}
      id='cam1'
      props={{ position: [0, 0, 3], lookAt: [0, 0, 0] }} />
    <DirectionalLight {scene} props={{ position: [3, 3, 3] }} />
    <AmbientLight {scene} props={{ color: 0xffffff, intensity: 1.25 }} />

    <Mesh
      {scene}
      geometry={cubeGeometry}
      material={cubeMaterial}
      mat={{ roughness: 0.5, metalness: 0.5, color: 0xff3e00 }}
      pos={[0, 0, 0]}
      interact
      onClick={triggerOnClickAni}
      onPointerOver={triggerOnOverAni}
      onPointerLeave={triggerOnOutAni} />
  </Scene>

  <WebGLRenderer
    {sti}
    sceneId='scene1'
    camId='cam1'
    config={{ antialias: true, alpha: false }} />
</Canvas>
