import * as THREE from "three";

interface RotationConfig {
    startPosition: THREE.Vector3;
    endPosition: THREE.Vector3;
    startEuler?: THREE.Euler; // Начальный поворот (по умолчанию текущий поворот объекта)
    endEuler: THREE.Euler;    // Конечный поворот
    duration?: number;        // Длительность (сек)
    steps?: number;           // Количество кадров
}

export function getSmoothRotationMixer(
    yourObject: THREE.Object3D,
    config: RotationConfig
): { quatValues: ArrayLike<number>; posValues: ArrayLike<number>; times: number[] } {
    const {
        startPosition,
        endPosition,
        startEuler,
        endEuler,
        duration = 4,
        steps = 100
    } = config;

    const times = [];
    const quatValues = [];
    const posValues = [];

    // Конвертируем углы Эйлера в кватернионы
    const startQuat = startEuler
        ? new THREE.Quaternion().setFromEuler(startEuler)
        : yourObject.quaternion.clone();
    const endQuat = new THREE.Quaternion().setFromEuler(endEuler);

    // Easing-функция для плавности
    const cubicEaseInOut = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        const easedT = cubicEaseInOut(t / duration);

        // Интерполяция вращения
        const currentQuat = new THREE.Quaternion();
        currentQuat.slerpQuaternions(startQuat, endQuat, easedT);

        // Интерполяция позиции с той же функцией плавности
        const currentPos = new THREE.Vector3().lerpVectors(
            startPosition,
            endPosition,
            easedT
        );

        times.push(t);
        quatValues.push(
            currentQuat.x,
            currentQuat.y,
            currentQuat.z,
            currentQuat.w
        );
        posValues.push(
            currentPos.x,
            currentPos.y,
            currentPos.z
        );
    }
    return {quatValues, posValues, times};
}

interface CameraPositionResult {
    position: THREE.Vector3;
    target: THREE.Vector3;
    distance: number;
    fov: number;
    aspectRatio: number;
}

interface SceneBounds {
    halfX: number;
    halfZ: number;
    halfY: number;
}

export function calculateCameraPosition(
    canvasWidth: number,
    canvasHeight: number,
    cameraHeight: number,
    sceneWidthX: number,
    sceneDepthZ: number,
    sceneHeightY: number
): CameraPositionResult {
    // 1. Инициализация базовых параметров
    const target: THREE.Vector3 = new THREE.Vector3(0, sceneHeightY / 2, 0);
    const aspectRatio: number = canvasWidth / Math.max(1, canvasHeight);
    const fov: number = 45;
    const fovRad: number = THREE.MathUtils.degToRad(fov);
    const angle: number = Math.PI / 4; // 45 градусов в радианах

    // 2. Расчет границ сцены
    const sceneBounds: SceneBounds = {
        halfX: sceneWidthX / 2,
        halfZ: sceneDepthZ / 2,
        halfY: sceneHeightY / 2
    };

    // 3. Создание тестовых точек для проверки видимости
    const createTestPoints = (bounds: SceneBounds): THREE.Vector3[] => {
        const { halfX, halfZ, halfY } = bounds;
        return [
            // Углы основания
            new THREE.Vector3(halfX, 0, halfZ),
            new THREE.Vector3(-halfX, 0, halfZ),
            new THREE.Vector3(halfX, 0, -halfZ),
            new THREE.Vector3(-halfX, 0, -halfZ),
            // Верхние углы
            new THREE.Vector3(halfX, sceneHeightY, halfZ),
            new THREE.Vector3(-halfX, sceneHeightY, halfZ),
            new THREE.Vector3(halfX, sceneHeightY, -halfZ),
            new THREE.Vector3(-halfX, sceneHeightY, -halfZ),
            // Центральные точки
            new THREE.Vector3(0, halfY, 0),
            new THREE.Vector3(halfX, halfY, 0),
            new THREE.Vector3(-halfX, halfY, 0),
            new THREE.Vector3(0, halfY, halfZ),
            new THREE.Vector3(0, halfY, -halfZ)
        ];
    };

    const testPoints: THREE.Vector3[] = createTestPoints(sceneBounds);

    // 4. Функция проверки видимости всех точек
    const isSceneFullyVisible = (distance: number): boolean => {
        const cameraPos: THREE.Vector3 = new THREE.Vector3(
            distance * Math.cos(angle),
            cameraHeight,
            distance * Math.sin(angle)
        );

        const testCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
            fov,
            aspectRatio,
            0.1,
            distance * 3
        );
        testCamera.position.copy(cameraPos);
        testCamera.lookAt(target);

        const frustum: THREE.Frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(
            new THREE.Matrix4().multiplyMatrices(
                testCamera.projectionMatrix,
                testCamera.matrixWorldInverse
            )
        );

        return testPoints.every((point: THREE.Vector3) => frustum.containsPoint(point));
    };

    // 5. Расчет начального расстояния
    const calculateInitialDistance = (): number => {
        const horizontalFov: number = 2 * Math.atan(Math.tan(fovRad / 2) * aspectRatio);
        const verticalFov: number = fovRad;

        const horizontalDistance: number = Math.max(sceneWidthX, sceneDepthZ) /
            (2 * Math.tan(horizontalFov / 2));
        const verticalDistance: number = sceneHeightY / (2 * Math.tan(verticalFov / 2));

        return Math.max(horizontalDistance, verticalDistance) * 1.5;
    };

    let distance: number = calculateInitialDistance();

    // 6. Оптимизация расстояния бинарным поиском
    const optimizeDistance = (initialDistance: number): number => {
        let minDist: number = initialDistance * 0.5;
        let maxDist: number = initialDistance * 1.2;
        const epsilon: number = 0.01;

        for (let i = 0; i < 20; i++) {
            const midDist: number = (minDist + maxDist) / 2;
            if (isSceneFullyVisible(midDist)) {
                maxDist = midDist;
            } else {
                minDist = midDist;
            }
            if (maxDist - minDist < epsilon) break;
        }

        return maxDist * 1.05; // 5% запас
    };

    distance = optimizeDistance(distance);

    // 7. Расчет финальной позиции камеры
    const calculateFinalCameraPosition = (dist: number): THREE.Vector3 => {
        return new THREE.Vector3(
            dist * Math.cos(angle),
            cameraHeight,
            dist * Math.sin(angle)
        );
    };

    return {
        position: calculateFinalCameraPosition(distance),
        target: target,
        distance: distance,
        fov: fov,
        aspectRatio: aspectRatio
    };
}

