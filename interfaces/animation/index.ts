import * as THREE from 'three';
import type { AnimationMixer } from 'three';

export class AnimationControlledRenderer {
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private clock: THREE.Clock;
    private mixers: AnimationMixer[];
    private isRendering: boolean;
    private animationId: number | null;

    constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.clock = new THREE.Clock();
        this.mixers = [];
        this.isRendering = false;
        this.animationId = null;
    }

    /**
     * Добавляет миксер в отслеживаемые и запускает рендеринг
     */
    addMixer(mixer: AnimationMixer): void {
        if (this.mixers.includes(mixer)) return;
        this.mixers.push(mixer);
        this.startRenderingIfNeeded();
    }

    /**
     * Удаляет миксер из отслеживаемых
     */
    removeMixer(mixer: AnimationMixer): void {
        const index = this.mixers.indexOf(mixer);
        if (index !== -1) {
            this.mixers.splice(index, 1);
        }
    }

    /**
     * Основной цикл рендеринга (точное соответствие вашей логике)
     */
    private animate(): void {
        const delta = this.clock.getDelta();
        let needsUpdate = false;
        // Обновляем все анимации и проверяем наличие изменений
        this.mixers.forEach(mixer => {
            mixer.update(delta);
            needsUpdate = true;
        });

        if (needsUpdate) {
            this.renderer.render(this.scene, this.camera);
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.isRendering = false;
            this.animationId = null;
        }
    }

    /**
     * Запускает рендеринг, если он ещё не активен
     */
    private startRenderingIfNeeded(): void {
        if (!this.isRendering) {
            this.isRendering = true;
            this.clock.start(); // Сбрасываем таймер
            this.animate();
        }
    }

    stopAll(): void {
        this.mixers.forEach(mixer => mixer.stopAllAction());
        this.mixers = [];
    }
    /**
     * Полностью останавливает рендеринг
     */
    stopRendering(): void {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRendering = false;
    }

    /**
     * Принудительно перезапускает рендеринг (полезно при изменениях сцены)
     */
    forceRender(): void {
        this.renderer.render(this.scene, this.camera);
    }
}
