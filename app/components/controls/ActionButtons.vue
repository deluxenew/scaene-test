<script setup lang="ts">
import type {CameraInterface} from "~~/interfaces/camera";
import {useDebounceFn} from "@vueuse/shared";


const camera: CameraInterface = useNuxtApp().$api.cameraInterface
camera.setCameraCenter()
const scene = useNuxtApp().$api.scene
const { sceneInterface }  = useNuxtApp().$api

const height = ref( 0)
const door = computed(() => scene.children.find((c) => c.name === "door"))
sceneInterface.buildScene().then(() => {

  height.value = door.value?.userData.config.geometryConfig.height
})

async function setNewGeometry(newHeight: number) {
  const newConfig = {
    ...door.value?.userData.config,
    geometryConfig: {...door.value?.userData.config.geometryConfig, height: newHeight},
    materialConfig: {...door.value?.userData.config.materialConfig, textureHeight: newHeight},
    position: {...door.value?.userData.config.position, y: newHeight / 2}
  }
  await door.value?.userData.interface.updateGeometry(door.value, newConfig)
  useNuxtApp().$api.updateCanvas()
}

const updateDebounce = useDebounceFn(() => setNewGeometry(height.value), 500)
</script>

<template>
    <div class="controls buttons">
      <div class="label">
        Настройки камеры
      </div>

      <div>
        <u-button class="btn" @click="camera.setCameraLeft()">
          КУБ
        </u-button>
        <u-button class="btn move w-1/2" @click="camera.setCameraCenter()">
          ДВЕРЬ
        </u-button>
        <u-button class="btn move w-1/2" @click="camera.setCameraRight()">
          ШАР
        </u-button>
      </div>
    </div>
    <div class="input_field">
      <div class="label">
        Высота двери
      </div>
      <input v-model="height" placeholder="Высота двери" class="form__field" @input="updateDebounce" @blur="setNewGeometry(height)" >
    </div>


</template>

<style lang="scss">
.controls {
  position: absolute;
  left: 16px;
  top: 16px;
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
}

.input_field {
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
}

.btn {
  padding: 10px 20px;
}

.move {
  left: 50%;
}

.label {
  font-size: 18px;
  color: #bab6b6;
}

input{
  appearance: none;
  border: none;
  outline: none;
  border-bottom: 2px solid #3e3c3c;
  background: rgba(#3E3C3CFF, .2);
  border-radius: 4px 4px 0 0;
  padding: 16px;
  font-size: 16px;
  color: #dad7d7;
}

</style>