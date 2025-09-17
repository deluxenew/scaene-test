import type {Config} from "../interfaces/object/types";
import {Color, Types} from "../interfaces/material/types";
import {TexturePaths} from "~~/interfaces/textureMaterial/types";

const itemsConfig: Config[] = [
    {
        name: 'door',
        geometryConfig: {
            width: 7,
            height: 20,
            depth: 0.5
        },
        materialConfig: {
            texturePath: TexturePaths.WOOD,
            color: Color.WHITE,
            textureHeight: 20,
            textureWidth: 7
        },
        position: {
            x: 4.5,
            y: 10,
            z: 4.25,
        },
        rotation: {
            x: 0,
            y: Math.PI / 6,
            z: 0,
        }
    },
    {
        name: 'box',
        geometryConfig: {
            width: 8,
            height: 8,
            depth: 8
        },
        materialConfig: {
            type: Types.STANDARD,
            color: Color.GREEN,
        },
        position: {
            x: 4,
            y: 4,
            z: 15,
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0,
        }
    },

    {
        name: 'sphere',
        geometryConfig: {
            radius: 4,
        },
        materialConfig: {
            type: Types.STANDARD,
            color: Color.BLUE,
        },
        position: {
            x: 17,
            y: 4,
            z: 4,
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0,
        }
    },
]

export default function (name: string): Config| undefined {
    return itemsConfig.find((item) => item.name === name);
}