import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

interface VehicleObject {
  model: THREE.Group;
  basePosition: THREE.Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  orbitOffset: number;
  mouseInfluence: THREE.Vector3;
}

export class FeaturesScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private container: HTMLElement;
  private animationId: number | null = null;
  private vehicles: VehicleObject[] = [];
  private time: number = 0;
  private mouse: THREE.Vector2;
  private raycaster: THREE.Raycaster;
  private loader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;
  private colorMap: THREE.Texture | null = null;
  private composer: EffectComposer | null = null;
  private customPass: ShaderPass | null = null;
  private customPass2: ShaderPass | null = null;
  private effectsIntensity = 0;
  private targetIntensity = 0;

  private readonly vehicleFiles = [
    "/assets/ambulance.glb",
    "/assets/firetruck.glb",
    "/assets/sedan-sports.glb",
    "/assets/taxi.glb",
    "/assets/tractor.glb",
    "/assets/truck.glb",
  ];

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.getAspect(), 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    // Setup mouse interaction
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    // Setup loaders
    this.loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    this.loader.setDRACOLoader(dracoLoader);

    this.textureLoader = new THREE.TextureLoader();

    this.controls = this.createControls();
    this.init();
    this.loadTextures().then(() => this.loadVehicles());
    this.setupMouseListeners();
  }

  private async loadTextures(): Promise<void> {
    try {
      this.colorMap = await new Promise((resolve, reject) => {
        this.textureLoader.load(
          "/assets/Textures/colormap.png",
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.flipY = false;
            resolve(texture);
          },
          undefined,
          reject
        );
      });
    } catch (error) {
      console.warn("Failed to load texture, using fallback:", error);
    }
  }

  private getAspect(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  private createControls(): OrbitControls {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    return controls;
  }

  private init(): void {
    // Setup renderer with transparency
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // Fully transparent
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);

    // Setup enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 30;
    mainLight.shadow.bias = -0.001;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xbfdbfe, 0.7);
    fillLight.position.set(-5, -2, -5);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 5, -10);
    this.scene.add(rimLight);

    // Setup post-processing
    this.setupPostProcessing();

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  private setupPostProcessing(): void {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    renderPass.clear = true; // Ensure background is cleared
    renderPass.clearAlpha = 0; // Make background transparent
    this.composer.addPass(renderPass);

    const rippleShader = {
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        intensity: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 base = texture2D(tDiffuse, vUv);
          float r = base.r + 0.02 * intensity * sin(time + vUv.y * 10.0);
          float g = base.g + 0.02 * intensity * sin(time + vUv.x * 10.0);
          float b = base.b + 0.02 * intensity * sin(time - vUv.y * 10.0);
          gl_FragColor = vec4(r, g, b, base.a);
        }
      `,
    };

    const waveShader = {
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        intensity: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 col = texture2D(tDiffuse, vUv);
          float avg = (col.r + col.g + col.b) / 3.0;
          float wave = 0.005 * intensity * sin(time * 40.0 + vUv.x * 50.0);
          col.rgb = mix(col.rgb, vec3(avg), wave);
          gl_FragColor = vec4(col.rgb, col.a);
        }
      `,
    };

    this.customPass = new ShaderPass(rippleShader);
    this.customPass2 = new ShaderPass(waveShader);

    this.composer.addPass(this.customPass);
    this.composer.addPass(this.customPass2);
  }

  private async loadVehicles(): Promise<void> {
    const loadPromises = this.vehicleFiles.map(async (file, index) => {
      try {
        const gltf = await this.loader.loadAsync(file);
        const model = gltf.scene;

        // Setup model with enhanced materials
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Create enhanced material
            const material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color(0xffffff),
              metalness: 0.4,
              roughness: 0.3,
              clearcoat: 0.8,
              clearcoatRoughness: 0.2,
              envMapIntensity: 1.5,
              transparent: true,
              opacity: 0.9, // Slightly transparent vehicles
            });

            // Apply texture if available
            if (this.colorMap) {
              material.map = this.colorMap;
            }

            // Apply material
            if (Array.isArray(child.material)) {
              child.material = child.material.map(() => material.clone());
            } else {
              child.material = material;
            }
          }
        });

        // Scale and position
        model.scale.setScalar(0.5);
        const radius = 8 + Math.random() * 4;
        const angle = (index / this.vehicleFiles.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        model.position.set(x, 0, z);

        // Add to scene
        this.scene.add(model);

        // Create vehicle object
        const vehicle: VehicleObject = {
          model,
          basePosition: new THREE.Vector3(x, 0, z),
          orbitRadius: radius,
          orbitSpeed: 0.1 + Math.random() * 0.2,
          rotationSpeed: 0.5 + Math.random() * 1.0,
          orbitOffset: Math.random() * Math.PI * 2,
          mouseInfluence: new THREE.Vector3(),
        };

        this.vehicles.push(vehicle);
      } catch (error) {
        console.error(`Error loading model ${file}:`, error);
      }
    });

    await Promise.all(loadPromises);
  }

  private setupMouseListeners(): void {
    const onMouseMove = (event: MouseEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      this.targetIntensity = this.targetIntensity === 0 ? 1 : 0;
    };

    this.container.addEventListener("mousemove", onMouseMove);
    this.container.addEventListener("contextmenu", onContextMenu);
  }

  private handleResize = (): void => {
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    if (this.composer) {
      this.composer.setSize(width, height);
    }
  };

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.01;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Smooth intensity transition
    this.effectsIntensity += (this.targetIntensity - this.effectsIntensity) * 0.05;

    // Update shader uniforms
    if (this.customPass?.uniforms) {
      this.customPass.uniforms.time.value = this.time;
      this.customPass.uniforms.intensity.value = this.effectsIntensity;
    }
    if (this.customPass2?.uniforms) {
      this.customPass2.uniforms.time.value = this.time;
      this.customPass2.uniforms.intensity.value = this.effectsIntensity;
    }

    // Animate vehicles
    this.vehicles.forEach((vehicle) => {
      // Orbital motion
      const angle = this.time * vehicle.orbitSpeed + vehicle.orbitOffset;
      const targetX = Math.cos(angle) * vehicle.orbitRadius;
      const targetZ = Math.sin(angle) * vehicle.orbitRadius;

      // LERP for smoother position updates
      const lerpFactor = 0.02; // Reduced for smoother motion
      vehicle.model.position.x +=
        (targetX + vehicle.mouseInfluence.x - vehicle.model.position.x) * lerpFactor;

      // Reduced vertical motion amplitude and smoother transitions
      const verticalOffset = Math.sin(this.time * 0.3 + vehicle.orbitOffset) * 0.5; // Reduced amplitude and frequency
      vehicle.model.position.y +=
        (1 + verticalOffset + vehicle.mouseInfluence.y - vehicle.model.position.y) * lerpFactor;

      vehicle.model.position.z +=
        (targetZ + vehicle.mouseInfluence.z - vehicle.model.position.z) * lerpFactor;

      // Smooth rotation with LERP
      const targetRotation = Math.atan2(
        vehicle.model.position.z - vehicle.basePosition.z,
        vehicle.model.position.x - vehicle.basePosition.x
      );
      const currentRotation = vehicle.model.rotation.y;
      vehicle.model.rotation.y += (targetRotation + Math.PI / 2 - currentRotation) * lerpFactor * 2;

      // Gentler floating rotation
      vehicle.model.rotation.x +=
        (Math.sin(this.time * 0.2 + vehicle.orbitOffset) * 0.05 - vehicle.model.rotation.x) *
        lerpFactor;
      vehicle.model.rotation.z +=
        (Math.cos(this.time * 0.15 + vehicle.orbitOffset) * 0.05 - vehicle.model.rotation.z) *
        lerpFactor;

      // Mouse interaction
      const intersects = this.raycaster.intersectObject(vehicle.model, true);
      if (intersects.length > 0) {
        const distance = intersects[0].distance;
        const influence = Math.max(0, 1 - distance / 10);
        vehicle.mouseInfluence.x += (this.mouse.x * 2 - vehicle.mouseInfluence.x) * influence * 0.1;
        vehicle.mouseInfluence.y += (this.mouse.y * 2 - vehicle.mouseInfluence.y) * influence * 0.1;
      } else {
        vehicle.mouseInfluence.multiplyScalar(0.95);
      }
    });

    this.controls.update();

    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  };

  public updateScroll(progress: number): void {
    // Smooth camera movement based on scroll
    const targetX = Math.sin(progress * Math.PI * 2) * 15;
    const targetZ = Math.cos(progress * Math.PI * 2) * 15;
    const targetY = 5 + Math.sin(progress * Math.PI) * 3;

    this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;
    this.camera.lookAt(0, 0, 0);
  }

  public dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener("resize", this.handleResize);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);

    // Dispose of textures
    if (this.colorMap) {
      this.colorMap.dispose();
    }

    // Dispose of vehicle models and materials
    this.vehicles.forEach((vehicle) => {
      vehicle.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    });

    if (this.composer) {
      this.composer.dispose();
    }
  }
}
