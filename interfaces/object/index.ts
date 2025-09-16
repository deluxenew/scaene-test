import {Mesh} from "three";
import type * as OBJ from "./types";
import type {BoxConfig} from "../geometry/types";
import type { Config as MaterialConfig, MaterialItem } from "../material/types";

import { GeometryInterface } from "../geometry";
import { MaterialInterface } from "../material";

export class ObjInterface {
    constructor(public objConfig: OBJ.Config) {
        if (!objConfig) {
            throw new Error("ObjConfig is required");
        }
    }

    get objItem(): Mesh {
        return this.createObjItem(this.objConfig);
    }

    private createGeometry(geometryConfig: BoxConfig) {
        if (!geometryConfig) {
            throw new Error("GeometryConfig is required");
        }
        const geometryInterface = new GeometryInterface(geometryConfig);
        return geometryInterface.geometry;
    }

    private createMaterial(materialConfig: MaterialConfig): MaterialItem {
        if (!materialConfig) {
            throw new Error("MaterialConfig is required");
        }
        const materialInstance = new MaterialInterface(materialConfig);
        return materialInstance.material;
    }

    private createObjItem(objConfig: OBJ.Config): Mesh {
        if (!objConfig) {
            throw new Error("ObjConfig is required");
        }

        const geometry = this.createGeometry(objConfig.geometryConfig);
        const material = this.createMaterial(objConfig.materialConfig);

        const obj = new Mesh(geometry, material);

        // Не вызываем dispose() здесь, так как меш использует эти ресурсы
        // Вместо этого можно сохранить ссылки для последующего освобождения
        obj.userData.config = objConfig;
        obj.userData.actions = this;
        obj.userData.dispose = () => {
            material.dispose();
            geometry.dispose();
        };

        return obj;
    }

    // Пример реализации метода для анимации
    // setAddAnimation(mesh: Mesh, animationConfig: any): void {
    //     // Реализация анимации
    // }
}