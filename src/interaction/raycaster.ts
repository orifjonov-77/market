import * as THREE from 'three';
import { ShelvesManager, InteractiveProduct } from '../scene/shelves';
import { CartManager } from '../cart/cart';
import { CartUi } from '../cart/cartUi';
import { LabelManager } from '../scene/labels';
import { ProductItem } from '../types';

/**
 * Foydalanuvchi nishoni va mahsulotlar bilan interaktiv muloqotni (Raycasting) boshqaradi.
 * Marketlarga ko'rsatganda 100% professional chiqishi uchun mahsulot brendi, nomi, toifasi
 * va narxi to'liq ma'lumotli karta sifatida ochiladi.
 */
export class InteractionManager {
  private camera: THREE.Camera;
  private shelvesManager: ShelvesManager;
  private cart: CartManager;
  private cartUi: CartUi;
  private labelManager: LabelManager;

  private raycaster = new THREE.Raycaster();
  private centerCoord = new THREE.Vector2(0, 0);
  private maxInteractionDistance = 4.2; // Yaqinlashganda yetish masofasi

  private currentTarget: InteractiveProduct | null = null;

  // Yangilangan UI elementlari
  private promptContainer: HTMLElement | null;
  private promptBadge: HTMLElement | null;
  private promptName: HTMLElement | null;
  private promptCategory: HTMLElement | null;
  private promptPrice: HTMLElement | null;
  private promptAddBtn: HTMLElement | null;
  private crosshair: HTMLElement | null;
  private mobileActionBtn: HTMLElement | null;

  constructor(
    camera: THREE.Camera,
    shelvesManager: ShelvesManager,
    cart: CartManager,
    cartUi: CartUi,
    labelManager: LabelManager
  ) {
    this.camera = camera;
    this.shelvesManager = shelvesManager;
    this.cart = cart;
    this.cartUi = cartUi;
    this.labelManager = labelManager;

    this.promptContainer = document.getElementById('interaction-prompt');
    this.promptBadge = document.getElementById('prompt-brand-badge');
    this.promptName = document.getElementById('prompt-name');
    this.promptCategory = document.getElementById('prompt-category');
    this.promptPrice = document.getElementById('prompt-price');
    this.promptAddBtn = document.getElementById('prompt-add-btn');
    this.crosshair = document.getElementById('crosshair');
    this.mobileActionBtn = document.getElementById('mobile-action-btn');

    this.initEvents();
  }

  private initEvents(): void {
    // 1. Ekranda chiqqan "🛒 Savatga qo'shish" tugmasini bosganda
    this.promptAddBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.addCurrentTargetToCart();
    });

    // 2. Klaviaturadagi 'E' yoki 'Enter' orqali tezkor savatga olish
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyE' || e.code === 'Enter') {
        if (this.currentTarget) {
          this.addCurrentTargetToCart();
        }
      }
    });

    // 3. Mobil ekrandagi yashil '🛒 Olish' tugmasi
    this.mobileActionBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.currentTarget) {
        this.addCurrentTargetToCart();
      }
    });

    // 4. Sichqoncha yoki ekranni to'g'ridan-to'g'ri bosganda
    window.addEventListener('pointerdown', (e) => {
      const target = e.target as HTMLElement;
      // Agar foydalanuvchi modal, floating tugma yoki boshqa UI ni bosayotgan bo'lsa xalaqit bermaymiz
      if (
        target.closest('#cart-modal') ||
        target.closest('#cart-floating-btn') ||
        target.closest('#instructions') ||
        target.closest('#interaction-prompt') ||
        target.closest('#mobile-controls')
      ) {
        return;
      }

      if (this.currentTarget) {
        this.addCurrentTargetToCart();
      }
    });
  }

  /**
   * Tanlangan mahsulotni savatga qo'shish va sakrash animatsiyasi
   */
  public addCurrentTargetToCart(): void {
    if (!this.currentTarget) return;

    const prod = this.currentTarget.product;
    this.cart.addItem(prod);
    this.cartUi.showToast(`🛒 "${prod.name}" savatga qo'shildi!`);

    this.triggerJumpAnimation(this.currentTarget);
  }

  private triggerJumpAnimation(target: InteractiveProduct): void {
    const group = target.group;
    const startY = target.originalY;
    const jumpHeight = 0.24;
    const duration = 280;
    const startTime = performance.now();

    const animateJump = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      group.position.y = startY + Math.sin(progress * Math.PI) * jumpHeight;

      if (progress < 1) {
        requestAnimationFrame(animateJump);
      } else {
        group.position.y = startY;
      }
    };

    requestAnimationFrame(animateJump);
  }

  /**
   * Har bir freymda nishonga olingan mahsulotni aniqlash
   */
  public update(): void {
    this.raycaster.setFromCamera(this.centerCoord, this.camera);
    const clickables = this.shelvesManager.getClickableObjects();
    const intersects = this.raycaster.intersectObjects(clickables, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      if (hit.distance <= this.maxInteractionDistance) {
        let targetGroup = hit.object.userData.parentGroup as THREE.Group;
        if (!targetGroup && (hit.object as THREE.Group).isGroup) {
          targetGroup = hit.object as THREE.Group;
        }

        const matched = this.shelvesManager.productMeshes.find((p) => p.group === targetGroup);
        if (matched) {
          this.setTarget(matched);
          return;
        }
      }
    }

    this.clearTarget();
  }

  private setTarget(target: InteractiveProduct): void {
    this.currentTarget = target;
    const prod: ProductItem = target.product;

    if (this.promptName && this.promptPrice && this.promptContainer && this.crosshair) {
      // 100% Aniq brend va toifa
      if (this.promptBadge) {
        this.promptBadge.textContent = prod.brand.toUpperCase();
      }
      if (this.promptCategory) {
        this.promptCategory.textContent = prod.category.replace('_', ' ').toUpperCase();
      }

      this.promptName.textContent = prod.name;
      this.promptPrice.textContent = `${prod.price.toLocaleString('uz-UZ')} so'm`;

      this.promptContainer.classList.remove('hidden');
      this.crosshair.classList.add('targeted');
    }

    this.labelManager.highlight(prod.id);
  }

  private clearTarget(): void {
    if (!this.currentTarget) return;

    this.currentTarget = null;
    if (this.promptContainer && this.crosshair) {
      this.promptContainer.classList.add('hidden');
      this.crosshair.classList.remove('targeted');
    }

    this.labelManager.highlight(null);
  }
}
