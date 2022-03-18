<script lang='ts'>
  import { onMount, SvelteComponent } from 'svelte';
  import createScene from './scene';

  let el: HTMLCanvasElement;

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