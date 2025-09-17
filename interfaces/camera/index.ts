import {Types} from "./types";
import type {CameraItem, Config} from "./types";
import {Euler} from "three";
import type {
    Vector3,
    QuaternionKeyframeTrack,
    VectorKeyframeTrack,
    AnimationClip,
    AnimationMixer,
    AnimationAction
} from "three";
import * as THREE from "three";
import {calculateCameraPosition, getSmoothRotationMixer} from "~~/interfaces/camera/utils";
import type {AnimationControlledRenderer} from "~~/interfaces/animation";

export class CameraInterface {
    // Приватные поля класса
    #camera: CameraItem;
    #mixer: AnimationMixer;
    #clip: AnimationClip;

    // Публичные поля класса
    mixerList: AnimationMixer[] = [];
    targetPosition: Vector3;
    controlledRenderer: AnimationControlledRenderer | null = null;

    constructor(public config: Config) {
        // Инициализация камеры на основе конфига
        this.#camera = this.setCamera(config);
        // Установка начального положения и поворота
        this.updateRotation(config);
        this.updatePosition(config);

        // Инициализация анимационного микшера
        this.#mixer = new THREE.AnimationMixer(this.#camera);

        // Дефолтные значения для анимации
        const lookAtVec = new THREE.Vector3(0, 0, 0);
        const positionVec = new THREE.Vector3(-10, 3, 0);
        this.#clip = this.createAnimationClip(lookAtVec, positionVec);

        // Установка слушателя завершения анимации
        this.#mixer.addEventListener('finished', this.finishAnimation.bind(this));

        // Инициализация целевой позиции
        this.targetPosition = this.#camera.position.clone();
        this.#camera.lookAt(new THREE.Vector3(0, 0, 0))
    }

    /**
     * Устанавливает контролируемый рендерер для управления анимациями
     * @param controlledRenderer - рендерер, управляющий анимациями
     */
    setControlledRenderer(controlledRenderer: AnimationControlledRenderer) {
        this.controlledRenderer = controlledRenderer;
    }

    /**
     * Обработчик завершения анимации
     * @param e - событие завершения анимации
     */
    finishAnimation(e: {action: AnimationAction; direction: number}) {
        const mixer = e.action.getMixer();
        this.controlledRenderer?.removeMixer(mixer);
    }

    // Геттер для доступа к камере
    get camera(): CameraItem {
        return this.#camera;
    }

    /**
     * Создает камеру на основе конфигурации
     * @param config - конфигурация камеры
     * @returns экземпляр камеры
     */
    setCamera(config: Config): CameraItem {
        switch (config.type) {
            case Types.PERSPECTIVE: {
                const {width, height} = config;
                return new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            }
            // Можно добавить другие типы камер при необходимости
        }
    }

    /**
     * Создает треки для анимации положения и поворота камеры
     * @param newLookAt - точка, в которую должна смотреть камера
     * @param newPosition - новая позиция камеры
     * @param duration - продолжительность анимации
     * @returns объект с треками позиции и кватерниона
     */
    private createTracks(
        newLookAt: Vector3,
        newPosition: Vector3,
        duration: number = 1
    ): {positionTrack: VectorKeyframeTrack; quatTrack: QuaternionKeyframeTrack} {
        const currentRotation = this.#camera.rotation.clone();
        const currentPosition = this.#camera.position.clone();

        // Создаем временную камеру для расчета целевого поворота
        const tempCamera = this.#camera.clone();
        tempCamera.position.copy(newPosition);
        tempCamera.lookAt(newLookAt);
        const targetRotation = tempCamera.rotation.clone();

        // Получаем сглаженные значения для анимации
        const {quatValues, times, posValues} = getSmoothRotationMixer(this.#camera, {
            duration,
            steps: 1000,
            startEuler: new Euler(currentRotation.x, currentRotation.y, currentRotation.z),
            endEuler: new Euler(targetRotation.x, targetRotation.y, targetRotation.z),
            startPosition: currentPosition,
            endPosition: newPosition,
        });

        return {
            positionTrack: new THREE.VectorKeyframeTrack(".position", times, posValues),
            quatTrack: new THREE.QuaternionKeyframeTrack(".quaternion", times, quatValues)
        };
    }

    /**
     * Создает клип анимации для камеры
     * @param newLookAt - точка, в которую должна смотреть камера
     * @param newPosition - новая позиция камеры
     * @param duration - продолжительность анимации
     * @returns клип анимации
     */
    private createAnimationClip(
        newLookAt: Vector3,
        newPosition: Vector3,
        duration: number = 1
    ): AnimationClip {
        const name = 'CameraAnimation_' + this.mixerList.length;
        const {positionTrack, quatTrack} = this.createTracks(newLookAt, newPosition, duration);

        return new THREE.AnimationClip(
            name,
            -1,
            [positionTrack, quatTrack],
            THREE.NormalAnimationBlendMode
        );
    }

    /**
     * Запускает анимацию перемещения камеры в новую позицию
     * @param newLookAt - точка, в которую должна смотреть камера
     * @param newPosition - новая позиция камеры
     */
    public setMoveCamera(
        newLookAt: { x: number; y: number; z: number },
        newPosition: { x: number; y: number; z: number }
    ): void {
        // Создаем новый микшер для анимации
        this.#mixer = new THREE.AnimationMixer(this.#camera);

        // Конвертируем параметры в Vector3
        const lookAtVec = new THREE.Vector3(newLookAt.x, newLookAt.y, newLookAt.z);
        this.targetPosition = new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z);

        // Создаем и настраиваем анимацию
        this.#clip = this.createAnimationClip(lookAtVec, this.targetPosition);
        this.#clip.optimize();

        const action = this.#mixer.clipAction(this.#clip);
        this.controlledRenderer?.stopAll();
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopOnce, 1);

        // Добавляем микшер в рендерер и запускаем анимацию
        this.controlledRenderer?.addMixer(this.#mixer);
        action.play();

        // Устанавливаем слушатель завершения анимации
        this.#mixer.addEventListener('finished', (e) => {
            const mixer = e.action.getMixer();
            this.controlledRenderer?.removeMixer(mixer);
        });
    }

    /**
     * Обновляет поворот камеры
     * @param config - конфигурация с новыми значениями поворота
     */
    updateRotation(config: Config): void {
        const {rotation: {x, y, z}} = config;
        this.#camera.rotation.set(x, y, z);
    }

    /**
     * Обновляет позицию камеры
     * @param config - конфигурация с новыми значениями позиции
     */
    updatePosition(config: Config): void {
        const {position: {x, y, z}} = config;
        this.#camera.position.set(x, y, z);
    }


    public setCameraCenter() {
        const cameraParams = calculateCameraPosition(
            window.innerWidth,
            window.innerHeight,
            10,
            2,
            3,
            20
        );

        this.setMoveCamera(cameraParams.target, cameraParams.position)
    }


    public setCameraLeft() {
        this.setMoveCamera(new THREE.Vector3(4, 4, 15), new THREE.Vector3(30, 10, 20))
    }

    public setCameraRight() {
        this.setMoveCamera(new THREE.Vector3(17, 4, 4), new THREE.Vector3(20, 10, 30))
    }
}