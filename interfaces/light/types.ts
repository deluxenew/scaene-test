import type { AmbientLight, DirectionalLight, RectAreaLight, SpotLight } from "three";

export enum Types {
    RECT_AREA_LIGHT = 'RECT_AREA_LIGHT',
    DIRECIONAL_LIGHT = 'DIRECIONAL_LIGHT',
    SPOT_LIGHT = 'SPOT_LIGHT',
    AMBIG_LIGHT = 'AMBIG_LIGHT',
}

export interface RectAreaLightConfig {
    type: Types.RECT_AREA_LIGHT
    intensity: number
    position: { x: number; y: number, z: number }
    rotation: { x: number; y: number, z: number }
    color: string
    width: number
    height: number
}

export interface DirectionalLightConfig {
    type: Types.DIRECIONAL_LIGHT
    intensity: number
    position: { x: number; y: number, z: number }
    rotation: { x: number; y: number, z: number }
}

export interface SpotLightConfig {
    type: Types.SPOT_LIGHT
    intensity: number
    position: { x: number; y: number, z: number }
    rotation: { x: number; y: number, z: number }
}

export interface AmbientLightConfig {
    type: Types.AMBIG_LIGHT
    intensity: number
    position: { x: number; y: number, z: number }
    rotation: { x: number; y: number, z: number }
}

export type Config = RectAreaLightConfig | DirectionalLightConfig | SpotLightConfig | AmbientLightConfig

export type LightItem = RectAreaLight | DirectionalLight | SpotLight | AmbientLight