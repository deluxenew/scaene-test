import { BoxGeometry } from "three";
import type {BoxConfig} from "./types";

export class GeometryInterface {
    constructor(private config: BoxConfig) {
        if (!config) {
            throw new Error("Geometry config is required");
        }
    }

    private createGeometry() {
        const {width = 1, height = 1, depth = 1} = this.config;
        return new BoxGeometry(width, height, depth);
    }

    get geometry() {
        return this.createGeometry();
    }
}