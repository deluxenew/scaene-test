<script setup lang="ts">
import CanvasComponent from "~/components/scene/CanvasComponent.vue";
import ActionButtons from "~/components/controls/ActionButtons.vue";

onMounted(() => {
  window.addEventListener('resize', useNuxtApp().$api.updateCanvas)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', useNuxtApp().$api.updateCanvas)
})
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <client-only>
      <CanvasComponent />
      <ActionButtons />
    </client-only>

  </div>

</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>