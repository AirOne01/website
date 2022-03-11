<script>
  import { onMount } from 'svelte';
  import { createScene } from './scene';

  let el;

  onMount(() => {
    createScene(el);
  });
</script>

<main>
  <canvas bind:this={el}></canvas>
</main>

<style lang='scss'>
  :global(body) {
    background: white;
    margin: 0;
  }
</style>