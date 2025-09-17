import type {
    Texture} from 'three';
import {
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    MathUtils,
    TextureLoader,
    RepeatWrapping,
    SRGBColorSpace,
    LinearMipmapLinearFilter,
    LinearFilter
} from 'three';

const wallWidth: number = 60 * 2;
const wallHeight: number = 40;

const wallGeometry: PlaneGeometry = new PlaneGeometry(wallWidth, wallHeight);
const floorGeometry: PlaneGeometry = new PlaneGeometry(wallWidth, wallWidth);

export const textureScale = (
    url: string,
    width: number,
    height: number,
    textureScale: number,
    rotate: boolean,
): Texture => {
    const textureLoader: TextureLoader = new TextureLoader();
    const texture: Texture = textureLoader.load(url, (): void => {
        texture.repeat.x = (width * 100) / (texture.image.width * textureScale);
        texture.repeat.y = (height * 100) / (texture.image.height * textureScale);
        texture.wrapS = texture.wrapT = RepeatWrapping;
    });
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 16;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;

    if (rotate) {
        texture.rotation = MathUtils.degToRad(180);
        texture.offset.x = 0;
        texture.offset.y = 0;
    }

    return texture;
};

const getImageTexure = (): string => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    const colorFill: string = '#F1F2F3';
    const bColor: string = '#cbccce';
    canvas.width = 1000;
    canvas.height = 1000;

    if (ctx) {
        ctx.fillStyle = bColor;
        ctx.fillRect(0, 0, 1000, 1000);
        ctx.fillStyle = colorFill;
        ctx.fillRect(10, 10, 990, 990);
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                ctx.fillStyle = bColor;
                ctx.fillRect(i === 0 ? 10 : i * 100, j === 0 ? 10 : j * 100, i * 100 + 100, j * 100 + 100);
                ctx.fillStyle = colorFill;
                ctx.fillRect(
                    5 + i * 100 + (i === 0 ? 5 : 0),
                    5 + j * 100 + (j === 0 ? 5 : 0),
                    95 + i * 100,
                    95 + j * 100,
                );
            }
        }
    }

    const url: string = canvas.toDataURL();
    canvas.remove();
    return url;
};

const texture1: Texture = textureScale(getImageTexure(), wallWidth, wallWidth, 1, false);

const floorMaterial: MeshStandardMaterial = new MeshStandardMaterial({
    map: texture1,
});

const texture: Texture = textureScale(getImageTexure(), wallWidth, wallHeight, 1, false);

const wallMaterial: MeshStandardMaterial = new MeshStandardMaterial({
    map: texture,
});

const wall: Mesh = new Mesh(wallGeometry, wallMaterial);
const wallR: Mesh = new Mesh(wallGeometry, wallMaterial);
const floor: Mesh = new Mesh(floorGeometry, floorMaterial);

floor.receiveShadow = true;
wallR.receiveShadow = true;
wall.receiveShadow = true;

wall.name = 'wall';

wallR.name = 'wallR';

wall.position.set(wallWidth / 2, wallHeight / 2, 0);
wallR.position.set(0, wallHeight / 2, wallWidth / 2);
floor.position.set(wallWidth / 2, 0, wallWidth / 2);
wallR.rotation.y = MathUtils.degToRad(90);
floor.rotation.x = MathUtils.degToRad(-90);

wallGeometry.dispose();
floorGeometry.dispose();
floorMaterial.dispose();
wallMaterial.dispose();

const walls: Mesh[] = [floor, wallR, wall];

export default walls