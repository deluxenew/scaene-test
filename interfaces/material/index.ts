import type * as Material from "./types.ts";
import {MeshStandardMaterial} from "three";
import {Types} from "./types";

export class MaterialInterface {
    constructor(public config: Material.Config) {
    }

    getMaterial(config: Material.Config): Material.MaterialItem  {
        switch (config.type) {
            case Types.STANDARD: {
                const { color = '#ffffff'} = config;
                return new MeshStandardMaterial({color})
            }
        }
    }

    get material(): Material.MaterialItem {
        return this.getMaterial(this.config)
    }


}