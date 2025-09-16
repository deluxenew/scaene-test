<script setup lang="ts">
const sceneRef = ref<HTMLElement | null>(null)
const {renderer, sceneInterface}  = useNuxtApp().$api

onMounted(() => {
  sceneRef.value?.appendChild(renderer.domElement);
})

sceneInterface.buildScene()
</script>

<template>
  <div ref="sceneRef" class="w-full h-full ref" />
</template>

<style scoped>
.ref {
  margin: 0;
  padding: 0;
}
</style>