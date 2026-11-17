import * as THREE from 'three';
import { StoreScene } from './scene/store';
import { LabelManager } from './scene/labels';
import { ShelvesManager } from './scene/shelves';
import { CollisionSystem } from './controls/collision';
import { PlayerControls } from './controls/player';
import { CartManager } from './cart/cart';
import { CartUi } from './cart/cartUi';
import { InteractionManager } from './interaction/raycaster';

/**
 * Supermarket ilovasi asosiy boshqaruvchi klassi (Maksimal sifat va optimallashtirish bilan)
 */
class MiniMarketApp {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;

  // Modullar
  private labelManager!: LabelManager;
  private storeScene!: StoreScene;
  private shelvesManager!: ShelvesManager;
  private collisionSystem!: CollisionSystem;
  private playerControls!: PlayerControls;
  private cartManager!: CartManager;
  private cartUi!: CartUi;
  private interactionManager!: InteractionManager;

  constructor() {
    const container = document.getElementById('canvas-container');
    if (!container) {
      throw new Error("Canvas konteyneri topilmadi!");
    }
    this.container = container;
    this.clock = new THREE.Clock();

    // 1. Sahna va Kamera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8fafc);
    this.scene.fog = new THREE.FogExp2(0xf8fafc, 0.012); // Yumshoq supermarket ichki atmosferasi

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);

    // 2. WebGL Renderer: Yuqori sifatli parametrlar
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Yumshoq tabiiy soyalar
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // Kinematografik ranglar
    this.renderer.toneMappingExposure = 1.18; // Aniq va yorqin supermarket yorug'ligi
    this.container.appendChild(this.renderer.domElement);

    this.initModules();
    this.initWindowEvents();

    this.animate();
  }

  private initModules(): void {
    try {
      this.labelManager = new LabelManager(this.container);
      this.storeScene = new StoreScene(this.scene);
      this.shelvesManager = new ShelvesManager(this.scene, this.labelManager);
      this.collisionSystem = new CollisionSystem(this.shelvesManager.shelfColliders);
      this.playerControls = new PlayerControls(this.camera, this.renderer.domElement, this.collisionSystem);
      this.cartManager = new CartManager();
      this.cartUi = new CartUi(this.cartManager);
      this.interactionManager = new InteractionManager(
        this.camera,
        this.shelvesManager,
        this.cartManager,
        this.cartUi,
        this.labelManager
      );

      console.log("Mini Market: Maksimal sifatli 3D Supermarket to'liq tayyor!");
    } catch (err) {
      console.error("Modullarni ishga tushirishda xatolik:", err);
    }
  }

  private initWindowEvents(): void {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.labelManager.resize(width, height);
    });
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const deltaTime = this.clock.getDelta();

    // 1. O'yinchi harakati va to'qnashuvlar
    this.playerControls.update(deltaTime);

    // 2. Raycast orqali nishonga olingan mahsulot
    this.interactionManager.update();

    // 3. Yaqin borgandagina narx va nomlarni chiqarish
    this.labelManager.updateDistances(this.camera.position);

    // 4. Render
    this.renderer.render(this.scene, this.camera);
    this.labelManager.render(this.scene, this.camera);
  };
}

window.addEventListener('DOMContentLoaded', () => {
  new MiniMarketApp();
});
