<script setup lang="ts">
import type {CameraInterface} from "~~/interfaces/camera";
import {useDebounceFn} from "@vueuse/shared";


const camera: CameraInterface = useNuxtApp().$api.cameraInterface
camera.setCameraCenter()
const scene = useNuxtApp().$api.scene

const door = scene.children.find((c) => c.name === "door")
const height = ref(door?.userData.config.geometryConfig.height || 0)

function setNewGeometry(newHeight: number) {
  const newConfig = {
    ...door?.userData.config,
    geometryConfig: {...door?.userData.config.geometryConfig, height: newHeight},
    position: {...door?.userData.config.position, y: newHeight / 2}
  }
  door?.userData.interface.updateGeometry(door, newConfig)
  useNuxtApp().$api.updateCanvas()
}



const updateDebounce = useDebounceFn(() => setNewGeometry(height.value), 500)
</script>

<template>
  <div>
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
      <div>
        <u-input v-model.number="height" @update:model-value="updateDebounce" @blur="setNewGeometry(height)" />
      </div>
    </div>
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