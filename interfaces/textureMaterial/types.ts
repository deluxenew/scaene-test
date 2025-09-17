import type {Color} from "~~/interfaces/material/types";

export enum TexturePaths {
    WOOD = 'textures/wood.png',
}

export interface TextureConfig {
    texturePath?: TexturePaths
    color?: Color
    textureWidth: number
    textureHeight: number

}
