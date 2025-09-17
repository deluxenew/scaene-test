import {BoxGeometry, Mesh} from "three";
import type * as OBJ from "./types";
import type {BoxConfig} from "../geometry/types";
import type {Config as MaterialConfig, MaterialItem} from "../material/types";

import {GeometryInterface} from "../geometry";
import {MaterialInterface} from "../material";
import type {TextureConfig} from "~~/interfaces/textureMaterial/types";
import TextureMaterial from "~~/interfaces/textureMaterial";

export class ObjInterface {
    constructor(public objConfig: OBJ.Config) {
        if (!objConfig) {
            throw new Error("ObjConfig is required");
        }
    }

    async objItem(): Promise<Mesh> {
        return await this.createObjItem(this.objConfig);
    }

    private createGeometry(geometryConfig: BoxConfig) {
        if (!geometryConfig) {
            throw new Error("GeometryConfig is required");
        }
        const geometryInterface = new GeometryInterface(geometryConfig);
        return geometryInterface.geometry;
    }

    private async createMaterial(materialConfig: MaterialConfig | TextureConfig): Promise<MaterialItem> {
        if (!materialConfig) {
            throw new Error("MaterialConfig is required");
        }
        if ((materialConfig as TextureConfig).texturePath) {
            const materialInstance = new TextureMaterial(materialConfig as TextureConfig)
            return await materialInstance.getMeshStandardMaterial()
        }
        const materialInstance = new MaterialInterface(materialConfig as MaterialConfig);
        return materialInstance.material;
    }

    public async createObjItem(objConfig: OBJ.Config): Promise<Mesh> {
        if (!objConfig) {
            throw new Error("ObjConfig is required");
        }


        const geometry = this.createGeometry(objConfig.geometryConfig);
        const material = await this.createMaterial(objConfig.materialConfig);
        const obj = new Mesh(geometry, material);

        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.name = objConfig.name;
        obj.userData.interface = this
        // Не вызываем dispose() здесь, так как меш использует эти ресурсы
        // Вместо этого можно сохранить ссылки для последующего освобождения
        obj.userData.config = objConfig;
        obj.userData.actions = this;
        obj.userData.dispose = () => {
            material.dispose();
            geometry.dispose();
        };

        this.setPosition(obj, this.objConfig)
        this.setRotation(obj)

        return obj;
    }

    setPosition(obj: Mesh, config: OBJ.Config) {
        const {position: {x = 0, y = 0, z = 0} = {}} = config;
        obj.position.set(x, y, z)
    }

    setRotation(obj: Mesh) {
        const {rotation: {x = 0, y = 0, z = 0} = {}} = this.objConfig;
        obj.rotation.set(x, y, z)
    }

    async updateGeometry(obj: Mesh, objConfig: OBJ.Config) {
        const {width, height, depth} = objConfig.geometryConfig;
        obj.geometry = new BoxGeometry(width, height, depth)
        obj.material = await this.createMaterial(objConfig.materialConfig)
        obj.updateMatrix()
        this.setPosition(obj, objConfig)
    }

    // Пример реализации метода для анимации
    // setAddAnimation(mesh: Mesh, animationConfig: any): void {
    //     // Реализация анимации
    // }
}