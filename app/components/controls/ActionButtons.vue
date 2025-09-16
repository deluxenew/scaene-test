<script setup lang="ts">
import type { CameraInterface } from "~~/interfaces/camera";

const camera: CameraInterface = useNuxtApp().$api.cameraInterface
camera.setCameraCenter()
</script>

<template>
  <div class="controls">
    <u-button class="btn" @click="camera.setCameraLeft()">
      left
    </u-button>
    <u-button class="btn move w-1/2" @click="camera.setCameraCenter()">
      center
    </u-button>
    <u-button class="btn move w-1/2" @click="camera.setCameraRight()">
      right
    </u-button>
  </div>
</template>

<style scoped>
.controls {
  position: absolute;
  left: 16px;
  top: 16px;
}

.btn {
  padding: 10px 20px;
}

.move {
  left: 50%;
}
</style>