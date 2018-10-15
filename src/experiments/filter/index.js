import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);

class Filter {
    init() {
        const loader = new THREE.TextureLoader();
        loader.load('/textures/02.jpg', texture => {
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
            this.controls = new OrbitControls(this.camera);

            const material = new THREE.ShaderMaterial({
                map:texture,
                vertexShader:`
                
                `,
                fragmentShader:`

                `
            });
            // const material = new THREE.MeshBasicMaterial({ map: texture });
            const geometry = new THREE.PlaneGeometry(6, 4);
            const mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);

            this.camera.position.z = 5;

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
            this.animate();
        })
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