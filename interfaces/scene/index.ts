import type { Scene} from "three";
import * as THREE from "three";
import {ObjInterface} from "~~/interfaces/object";
import itemsConfig from "~~/configs/ItemsConfig";

export class SceneInterface {
    public scene: Scene;
    constructor() {
        this.scene = new THREE.Scene();
    }

    buildScene() {
        // Очищаем сцену
        while (this.scene.children.length > 0) {
            if (this.scene.children[0]) this.scene.remove(this.scene.children[0]);
        }

        // Создаем ящики вдоль осей
        // const boxesX = createBoxesAlongX(10, 0, 1.01); // 10 ящиков по оси X от -10 с шагом 2
        // const boxesZ = createBoxesAlongZ(10, 0, 1.01); // 10 ящиков по оси Z от -10 с шагом 2

        // Добавляем центральный ящик в начале координат
        const config = itemsConfig('door')
        if (config) {
            const boxFirst = new ObjInterface(config).objItem;
            const boxes = [boxFirst]
            boxes.forEach((box) => {
                this.scene.add(box);
            });
        }

        // Освещение
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);

        // Добавляем оси для наглядности
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);
    }

}