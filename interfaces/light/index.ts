import type { Config, LightItem } from "./types";
import { Types } from "./types";
import { RectAreaLight, Color } from "three";

export class LightInterface {
    constructor(private config: Config) {
        if (!config) {
            throw new Error("Light config is required");
        }
    }

    get lightItem(): LightItem {
        return this.createLightItem();
    }

    private applyPositionAndRotation(light: LightItem): void {
        if (this.config.position) {
            const { x = 0, y = 0, z = 0 } = this.config.position;
            light.position.set(x, y, z);
        }

        if (this.config.rotation) {
            const { x = 0, y = 0, z = 0 } = this.config.rotation;
            light.rotation.set(x, y, z);
        }
    }

    private createLightItem(): LightItem {
        switch (this.config.type) {
            case Types.RECT_AREA_LIGHT: {
                const {
                    color = 0xffffff,
                    intensity = 1,
                    width = 10,
                    height = 10,
                } = this.config;

                const lightItem = new RectAreaLight(
                    new Color(color),
                    intensity,
                    width,
                    height
                );

                this.applyPositionAndRotation(lightItem);
                return lightItem;
            }
            default:
                throw new Error(`Unsupported light type: ${this.config.type}`);
        }
    }
}