import * as THREE from 'three';
import * as Color from './color';
import ImprovedNoise from './improvedNoise';
const OrbitControls = require('three-orbit-controls')(THREE);

const FOG_COLOR = Color.create(0.74, 0.77, 0.91);
const worldWidth = 256,
    worldDepth = 256,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2;

export default class World {
    constructor(props) {
        // this.grassPatchRadius = props.grassPatchRadius;
        // this.displayWidth = props.displayWidth;
        // this.displayHeight = props.displayHeight;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.meshes = { terrain: null, grass: null, sky: null, water: null, sunFlare: null, fade: null };
        this.scene = new THREE.Scene();

        this.init();
    }

    init() {
        const container = document.body;
        // const fogDist = this.grassPatchRadius * 20.0;
        // const grassFogDist = this.grassPatchRadius;
        // scene.fog = new THREE.Fog(Color.to24bit(FOG_COLOR), 0.1, fogDist);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
        this.controls = new OrbitControls(this.camera);

        // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const cube = new THREE.Mesh(geometry, material);
        // this.scene.add(cube);
        // this.camera.position.z = 5;

        const data = this.generateHeight(worldWidth, worldDepth);
        this.camera.position.y = data[worldHalfWidth + worldHalfDepth * worldWidth] * 10 + 500;

        const geometry = new THREE.PlaneBufferGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
        geometry.rotateX(-Math.PI / 2);
        const vertices = geometry.attributes.position.array;

        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10;
        }

        const loader = new THREE.TextureLoader();
        loader.load('/textures/02.jpg', texture => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
            this.scene.add(mesh);
            // this.renderer.render(this.scene, this.camera);
        });

        container.appendChild(this.renderer.domElement);
        this.animate();
    }

    animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * @description threejs terrain demo
     * @memberof World
     */
    initTerrain() {
        const worldWidth = 256;
        const worldDepth = 256;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xbfd1e5);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);

        const data = this.generateHeight(worldWidth, worldDepth);

        camera.position.y = data[worldWidth / 2 + worldDepth / 2 * worldWidth];

        const geometry = new THREE.PlaneBufferGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
        geometry.rotateX(-Math.PI / 2);

        const vertices = geometry.attributes.position.array;
        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10;
        }

        const texture = new THREE.CanvasTexture(this.generateTexture(data, worldWidth, worldDepth));
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
        scene.add(mesh);
    }

    generateHeight(width, height) {
        const size = width * height;
        const data = new Uint8Array(size);
        const perlin = new ImprovedNoise();
        let quality = 1;
        const z = Math.random() * 100;

        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < size; i++) {
                const x = i % width;
                const y = ~~(i / width);
                data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
            }
            quality *= 5;
        }
        return data;
    }

    generateTexture() {
        const vector3 = new THREE.Vector3(0, 0, 0);
        const sun = new THREE.Vector3(1, 1, 1);
        sun.normalize();

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        context.fillStyle = '#000';
        context.fillRect(0, 0, width, height);

        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        const imageData = image.data;

        for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
            vector3.x = data[j - 2] - data[j + 2];
        }
    }
}
