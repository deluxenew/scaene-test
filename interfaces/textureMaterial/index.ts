import * as THREE from "three";

import type {TextureConfig} from "./types";
import type {MaterialItem} from "~~/interfaces/material/types";

const loader = new THREE.TextureLoader();

export default class TextureMaterial {

    constructor(public config: TextureConfig) {
        this.config = config;
    }

    public async getMeshStandardMaterial(): Promise<MaterialItem> {
        const {
            color,
            texturePath,
            textureWidth,
            textureHeight,

        } = this.config

        const repeatX = textureWidth
        const repeatY = textureHeight

        const texture = texturePath && await loader.loadAsync(texturePath)

        if (texture && textureWidth && textureHeight) {
            texture.repeat.x = repeatX /10
            texture.repeat.y = repeatY /10
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }

        const params = {
            color: color,
            opacity: 0,
            ...(texture && {map: texture}),
        }

        return new THREE.MeshStandardMaterial(params)
    }
}
