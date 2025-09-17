import type {MeshStandardMaterial} from "three";

export type MaterialItem = MeshStandardMaterial

export enum Types {
    STANDARD = 'STANDARD',
}

export enum Color {
    WHITE = '#ffffff',
    GREEN = '#00ff00',
    BLUE = '#0000ff',
}


export interface StandardConfig {
    type: Types.STANDARD
    color: Color
}

export type Config = StandardConfig



