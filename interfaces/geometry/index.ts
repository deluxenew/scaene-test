import {BoxGeometry, SphereGeometry} from "three";
import type { GeometryConfig} from "./types";

export class GeometryInterface {
    constructor(private config: GeometryConfig) {
        if (!config) {
            throw new Error("Geometry config is required");
        }
    }

    private createBoxGeometry() {
        const {width = 1, height = 1, depth = 1} = this.config;
        return new BoxGeometry(width, height, depth);
    }

    private createSphereGeometry() {
        const {radius} = this.config;
        return new SphereGeometry(radius);
    }

    get geometry() {
        if (this.config.radius) return this.createSphereGeometry()
        return this.createBoxGeometry();
    }
}