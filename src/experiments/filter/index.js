import * as THREE from 'three';
import * as dat from 'dat.gui';
const OrbitControls = require('three-orbit-controls')(THREE);

class Filter {
    constructor() {
        this.params = {
            red: 1.0,
            green: 1.0,
            blue: 1.0,
            alpha: 1.0
        }
        this.uniforms = {
            red: { value: this.params.red },
            green: { value: this.params.green },
            blue: { value: this.params.blue },
            alpha: { value: this.params.alpha },
            texture: { value: null },
        };
    }
    init() {
        const loader = new THREE.TextureLoader();
        loader.load('/textures/02.jpg', texture => {
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
            this.controls = new OrbitControls(this.camera);
            this.uniforms.texture.value = texture;

            const material = new THREE.ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: `
                varying vec2 vUv;
                void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix *  vec4(position, 1.0);
                }
                `,
                fragmentShader: `
                    uniform sampler2D texture;
                    uniform float red;
                    uniform float green;
                    uniform float blue;
                    uniform float alpha;
                    varying vec2 vUv;
                    void main(){
                        vec4 tcolor = texture2D(texture, vUv);
                        gl_FragColor = vec4(tcolor.r * red, tcolor.g * green, tcolor.b * blue, alpha);   
                    }
                `
            });
            const geometry = new THREE.PlaneGeometry(6, 4);
            const mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);

            this.camera.position.z = 5;

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
            this.renderGUI();
            this.animate();
        });
    }
    handleColorChange() {
        console.log(this.params);
        this.uniforms.red.value = this.params.red;
        this.uniforms.green.value = this.params.green;
        this.uniforms.blue.value = this.params.blue;
        this.uniforms.alpha.value = this.params.alpha;
    }
    renderGUI() {
        const gui = new dat.GUI({ width: 300 });
        const folderColor = gui.addFolder('Color');
        folderColor.add(this.params, 'red', 0, 1).step(0.01).onChange(this.handleColorChange.bind(this));
        folderColor.add(this.params, 'green', 0, 1).step(0.01).onChange(this.handleColorChange.bind(this));
        folderColor.add(this.params, 'blue', 0, 1).step(0.01).onChange(this.handleColorChange.bind(this));
        folderColor.add(this.params, 'alpha', 0, 1).step(0.01).onChange(this.handleColorChange.bind(this));
        folderColor.open();
    }
    animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }
}

window.onload = () => {
    const filter = new Filter();
    filter.init();
}