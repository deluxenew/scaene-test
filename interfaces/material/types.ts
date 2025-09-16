import type {MeshStandardMaterial} from "three";

export type MaterialItem = MeshStandardMaterial

export enum Types {
    STANDARD = 'STANDARD',
}

export enum Color {
    WHITE = '#ffffff',
}


export interface StandardConfig {
    type: Types.STANDARD
    color: Color
}

export type Config = StandardConfig



