import type { Scene } from "three";
import * as THREE from "three";
import { ObjInterface } from "~~/interfaces/object";
import itemsConfig from "~~/configs/ItemsConfig";
import walls from "~~/interfaces/scene/walls";

export class SceneInterface {
    public scene: Scene;
    private readonly directionalLight: THREE.DirectionalLight;

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0); // Светлый фон для лучшего восприятия
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        this.directionalLight.position.set(5, 25, 15);
        this.directionalLight.castShadow = true;

        // Настройки теней для мягкости
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        this.directionalLight.shadow.camera.left = -20;
        this.directionalLight.shadow.camera.right = 20;
        this.directionalLight.shadow.camera.top = 20;
        this.directionalLight.shadow.camera.bottom = -20;

        // Мягкие тени
        this.directionalLight.shadow.radius = 3;
        this.directionalLight.shadow.bias = -0.0001;
    }

    addWalls() {
        walls.forEach((wall) => {
            this.scene.add(wall);
        });
    }

    setupLighting() {
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Light) {
                this.scene.remove(child);
            }
        });

        this.scene.add(this.directionalLight);
    }

    buildScene() {
        // Очищаем сцену
        while (this.scene.children.length > 0) {
            if (this.scene.children[0]) this.scene.remove(this.scene.children[0]);
        }

        // Добавляем объекты
        const boxes = [];
        const doorConfig = itemsConfig('door');
        if (doorConfig) {
            boxes.push(new ObjInterface(doorConfig).objItem);
        }
        const boxConfig = itemsConfig('box');
        if (boxConfig) {
            boxes.push(new ObjInterface(boxConfig).objItem);
        }

        const sphereConfig = itemsConfig('sphere');
        if (sphereConfig) {
            boxes.push(new ObjInterface(sphereConfig).objItem);
        }

        boxes.forEach((box) => {
            this.scene.add(box);
        });

        // Настраиваем освещение
        this.setupLighting();

        this.addWalls();

        // Добавляем пол для теней
        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -5;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }
}