import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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

  private readonly vehicleFiles = [
    '/assets/ambulance.glb',
    '/assets/firetruck.glb',
    '/assets/sedan-sports.glb',
    '/assets/taxi.glb',
    '/assets/tractor.glb',
    '/assets/truck.glb'
  ];

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.getAspect(), 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    // Setup mouse interaction
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    // Setup loaders
    this.loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
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
          '/assets/Textures/colormap.png',
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
      console.warn('Failed to load texture, using fallback:', error);
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
    // Setup renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
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

    // Start animation
    this.animate();

    // Handle resize
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
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
              envMapIntensity: 1.5
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
          mouseInfluence: new THREE.Vector3()
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

    this.container.addEventListener('mousemove', onMouseMove);
  }

  private handleResize = (): void => {
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.01;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Animate vehicles
    this.vehicles.forEach((vehicle) => {
      // Orbital motion
      const angle = this.time * vehicle.orbitSpeed + vehicle.orbitOffset;
      const targetX = Math.cos(angle) * vehicle.orbitRadius;
      const targetZ = Math.sin(angle) * vehicle.orbitRadius;
      
      // Smooth position update with mouse influence
      vehicle.model.position.x += (targetX + vehicle.mouseInfluence.x - vehicle.model.position.x) * 0.05;
      vehicle.model.position.y += (2 + Math.sin(this.time + vehicle.orbitOffset) + vehicle.mouseInfluence.y - vehicle.model.position.y) * 0.05;
      vehicle.model.position.z += (targetZ + vehicle.mouseInfluence.z - vehicle.model.position.z) * 0.05;

      // Rotation to follow path
      const targetRotation = Math.atan2(
        vehicle.model.position.z - vehicle.basePosition.z,
        vehicle.model.position.x - vehicle.basePosition.x
      );
      vehicle.model.rotation.y = targetRotation + Math.PI / 2;

      // Additional floating rotation
      vehicle.model.rotation.x = Math.sin(this.time * 0.5 + vehicle.orbitOffset) * 0.1;
      vehicle.model.rotation.z = Math.cos(this.time * 0.3 + vehicle.orbitOffset) * 0.1;

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
    this.renderer.render(this.scene, this.camera);
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
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    });
  }
}
