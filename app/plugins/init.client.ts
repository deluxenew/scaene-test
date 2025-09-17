import {defineNuxtPlugin} from "#imports";
import * as THREE from "three";
import CameraConfig from "~~/configs/CameraConfig";
import {CameraInterface} from "~~/interfaces/camera";
import {AnimationControlledRenderer} from "~~/interfaces/animation";
import {SceneInterface} from "~~/interfaces/scene";
import {PCFSoftShadowMap} from "three";

export default defineNuxtPlugin({
    name: 'my-plugin',
    enforce: 'pre',
    async setup () {
        const renderer = new THREE.WebGLRenderer({antialias: true, depth: true});
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = PCFSoftShadowMap
        setRendererSize()

        const cameraConfig = CameraConfig({width: window.innerWidth, height: window.innerHeight})
        const cameraInterface = new CameraInterface(cameraConfig)
        const camera = cameraInterface.camera

        const sceneInterface = new SceneInterface()
        const scene = sceneInterface.scene
        scene.add(camera)

        const controlledRenderer = new AnimationControlledRenderer(scene, camera, renderer);
        cameraInterface.setControlledRenderer(controlledRenderer)
        function setRendererSize() {
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        function updateCanvas() {
            if (!renderer || !camera) return
            setRendererSize()
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            controlledRenderer.forceRender()
        }

        return {
            provide: {
                api: {
                    renderer,
                    cameraInterface,
                    scene,
                    sceneInterface,
                    camera,
                    controlledRenderer,
                    updateCanvas
                }
            }
        }
    },
})