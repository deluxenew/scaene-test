import type {GeometryConfig} from "../geometry/types";
import type {Config as MaterialConfig} from "../material/types";
import type {TextureConfig} from "~~/interfaces/textureMaterial/types";

export interface Config {
    name: string;
    geometryConfig: GeometryConfig
    materialConfig: MaterialConfig | TextureConfig
    position: {
        x: number;
        y: number;
        z: number;
    }
    rotation: {
        x: number;
        y: number;
        z: number;
    }
}