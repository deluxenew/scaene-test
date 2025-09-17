import type {Config} from "../interfaces/object/types";
import {Color, Types} from "../interfaces/material/types";

const itemsConfig: Config[] = [
    {
        name: 'door',
        geometryConfig: {
            width: 7,
            height: 20,
            depth: 0.5
        },
        materialConfig: {
            type: Types.STANDARD,
            color: Color.WHITE,
        },
        position: {
            x: 3.5,
            y: 10,
            z: 0.25,
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