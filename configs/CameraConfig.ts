import type {Config } from "../interfaces/camera/types";
import {Types, Names} from "../interfaces/camera/types";

export default function({ width, height }: { width: number; height: number }): Config {
    return {
        name: Names.GENERAL,
        width,
        height,
        type: Types.PERSPECTIVE,
        zoom: 1,
        position: { x: 10, y: 3, z: 10 },
        rotation: { x: 0, y: 0, z: 0 }
    }
}