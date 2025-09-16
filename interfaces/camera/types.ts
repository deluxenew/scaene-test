
import type {PerspectiveCamera} from "three";
export type CameraItem = PerspectiveCamera

export enum Types {
    PERSPECTIVE = 'PERSPECTIVE',
}

export enum Names {
    GENERAL = 'GENERAL',
}

export interface PerspectiveCameraConfig {
    name: Names;
    width: number;
    height: number;
    type: Types.PERSPECTIVE
    zoom: number
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
}


export type Config = PerspectiveCameraConfig