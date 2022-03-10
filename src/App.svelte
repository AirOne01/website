<script>
  import gsap from 'gsap';
  import { onMount } from 'svelte';
  import {
    AmbientLight,
    BoxGeometry,
    DirectionalLight,
    FontLoader,
    MathUtils,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Raycaster,
    Scene,
    TextGeometry,
    WebGLRenderer,
    Vector2,
    Vector3,
  } from 'three';

  const rows = 4;
  const columns = 20;
  const colors = [
    0x581845,
    0x900c3f,
    0xc70039,
    0xff5733,
    0xffc300
  ]
  let canvas;

  onMount(() => {
    let currentBig = null;

    const scene = new Scene();
    const cam = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new WebGLRenderer({ antialias: true, canvas: canvas });
    renderer.setSize(1600, 900);

    const light = new AmbientLight(0xffffff, 0.5);
    scene.add(light);

    const cubeMaterial = new MeshStandardMaterial();
    const geometry = new BoxGeometry(1, 1, 1);

    const mesh = new Mesh(geometry, cubeMaterial);
    scene.add(mesh);

    animate(renderer, scene, cam);
  });

  function animate(renderer, scene, camera) {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  }

  function onClick(e) {
    let obj = e.detail.target;
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

  function onPointerOver(e) {
    let obj = e.detail.target;
    if (!obj.isBig) {
      let obj = e.detail.target;
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

  function onPointerMove(e) {
    let obj = e.detail.target;
    if (!obj.isBig) return;

    let unpr = new Vector3().copy(e.detail.unprojected);
    let unprwtl = obj.worldToLocal(unpr).add(new Vector3(0, 0, 6));
    obj.lookAt(unprwtl);
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

  let innerHeight, innerWidth;
</script>

<svelte:window bind:innerHeight bind:innerWidth/>

<main>
  <canvas bind:this={canvas}/>
</main>

<style lang='scss'>
  :global(body) {
    background: white;
  }
</style>