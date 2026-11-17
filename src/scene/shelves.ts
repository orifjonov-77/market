import * as THREE from 'three';
import { ProductItem } from '../types';
import productsData from '../data/products.json';
import { LabelManager } from './labels';
import { ProductModelFactory } from './productFactory';

export interface InteractiveProduct {
  group: THREE.Group;
  product: ProductItem;
  originalY: number;
}

/**
 * Supermarket javonlari klassi:
 * Har bir bo'limda FAQAT o'z toifasidagi mahsulotlar turadi!
 * - 1-bo'lim: FAQAT ICHIMLIKLAR VA SUVLAR (Pepsi, Cola, Fanta, Sprite, Montella, Nestlé, Sharbatlar)
 * - 2-bo'lim: FAQAT SHIRINLIKLAR (Snickers, Twix, KitKat, Milka, Nutella, Oreo, ChocoPie, M&Ms)
 * - 3-bo'lim: FAQAT KONSERVALAR (Tunes baliq, Bonduelle jo'xori, no'xat, zaytun, bodring, qo'ziqorin, tomat)
 * - 4-bo'lim: FAQAT BAQQOLLIK (Yog', guruch, makaron, choy, qahva, shakar, un, tuz)
 */
export class ShelvesManager {
  private scene: THREE.Scene;
  private labelManager: LabelManager;
  public shelfColliders: THREE.Box3[] = [];
  public productMeshes: InteractiveProduct[] = [];
  public clickableMeshes: THREE.Object3D[] = [];

  constructor(scene: THREE.Scene, labelManager: LabelManager) {
    this.scene = scene;
    this.labelManager = labelManager;
    this.buildSupermarketRows();
  }

  private buildSupermarketRows(): void {
    const allProducts: ProductItem[] = productsData as ProductItem[];

    // Mahsulotlarni qat'iy kategoriyalariga ajratamiz (aralashtirmasdan!)
    const drinks = allProducts.filter((p) => p.category === 'ichimliklar');
    const sweets = allProducts.filter((p) => p.category === 'shirinliklar');
    const canned = allProducts.filter((p) => p.category === 'konserva');
    const grocery = allProducts.filter((p) => p.category === 'baqqollik');

    // Har bir bo'lim alohida javon qatoriga ega:
    const aisleConfigs = [
      {
        category: 'ichimliklar',
        title: 'ICHIMLIKLAR VA SUVLAR BO\'LIMI',
        x: 6.5,
        z: -4,
        products: drinks,
      },
      {
        category: 'shirinliklar',
        title: 'SHIRINLIKLAR VA PECHYONELAR',
        x: -6.5,
        z: -4,
        products: sweets,
      },
      {
        category: 'konserva',
        title: 'KONSERVA VA BALIQ BO\'LIMI',
        x: -6.5,
        z: 4,
        products: canned,
      },
      {
        category: 'baqqollik',
        title: 'BAQQOLLIK VA OZIQ-OVQAT',
        x: 6.5,
        z: 4,
        products: grocery,
      },
    ];

    aisleConfigs.forEach((config) => {
      this.createSupermarketAisle(config.x, config.z, config.title, config.products);
    });
  }

  private createSupermarketAisle(
    centerX: number,
    centerZ: number,
    aisleTitle: string,
    categoryProducts: ProductItem[]
  ): void {
    const shelfWidth = 10.0;
    const shelfHeight = 2.6;
    const shelfDepth = 1.0;

    // To'q qizil supermarket metalli (rasmdagi rang)
    const shelfRedMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.35,
      metalness: 0.25,
    });

    const shelfWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });

    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.15,
    });

    const rowGroup = new THREE.Group();
    rowGroup.position.set(centerX, 0, centerZ);

    // 1. Orqa oq panel
    const backPanel = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.04),
      shelfWhiteMat
    );
    backPanel.position.set(0, shelfHeight / 2, 0);
    backPanel.castShadow = true;
    rowGroup.add(backPanel);

    // 2. Vertikal qizil ustunlar
    const postGeo = new THREE.BoxGeometry(0.08, shelfHeight, 0.08);
    for (let x = -shelfWidth / 2; x <= shelfWidth / 2 + 0.01; x += 1.6) {
      const post = new THREE.Mesh(postGeo, shelfRedMat);
      post.position.set(x, shelfHeight / 2, 0);
      post.castShadow = true;
      rowGroup.add(post);
    }

    // 3. Pastki to'q qizil taglik
    const basePodium = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth, 0.22, shelfDepth),
      shelfRedMat
    );
    basePodium.position.set(0, 0.11, 0);
    basePodium.castShadow = true;
    rowGroup.add(basePodium);

    // 4. JAVONNING 6 TA QAVATI
    const tierHeights = [0.22, 0.65, 1.08, 1.51, 1.94, 2.37];
    const boardGeo = new THREE.BoxGeometry(shelfWidth, 0.04, shelfDepth);

    // Narx qog'ozi kanali teksturasi
    const tagCanvas = document.createElement('canvas');
    tagCanvas.width = 512;
    tagCanvas.height = 32;
    const tCtx = tagCanvas.getContext('2d')!;
    tCtx.fillStyle = '#991b1b';
    tCtx.fillRect(0, 0, 512, 32);
    tCtx.fillStyle = '#ffffff';
    for (let tx = 10; tx < 500; tx += 60) {
      tCtx.fillRect(tx, 4, 45, 24);
    }
    const tagTex = new THREE.CanvasTexture(tagCanvas);
    tagTex.wrapS = THREE.RepeatWrapping;
    tagTex.repeat.set(8, 1);
    const tagMat = new THREE.MeshBasicMaterial({ map: tagTex });

    tierHeights.forEach((tierY) => {
      const board = new THREE.Mesh(boardGeo, shelfWhiteMat);
      board.position.set(0, tierY, 0);
      board.receiveShadow = true;
      board.castShadow = true;
      rowGroup.add(board);

      const frontEdge = new THREE.Mesh(
        new THREE.BoxGeometry(shelfWidth, 0.06, 0.03),
        tagMat
      );
      frontEdge.position.set(0, tierY + 0.02, shelfDepth / 2 + 0.01);
      rowGroup.add(frontEdge);

      const backEdge = new THREE.Mesh(
        new THREE.BoxGeometry(shelfWidth, 0.06, 0.03),
        tagMat
      );
      backEdge.position.set(0, tierY + 0.02, -shelfDepth / 2 - 0.01);
      rowGroup.add(backEdge);

      // Metall sim to'siq
      const wireGeo = new THREE.CylinderGeometry(0.005, 0.005, shelfWidth, 8);
      const wireFront = new THREE.Mesh(wireGeo, wireMat);
      wireFront.rotation.z = Math.PI / 2;
      wireFront.position.set(0, tierY + 0.07, shelfDepth / 2 + 0.015);
      rowGroup.add(wireFront);

      const wireBack = new THREE.Mesh(wireGeo, wireMat);
      wireBack.rotation.z = Math.PI / 2;
      wireBack.position.set(0, tierY + 0.07, -shelfDepth / 2 - 0.015);
      rowGroup.add(wireBack);
    });

    // 5. Yuqori bo'lim sarlavhasi
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth * 0.7, 0.4, 0.06),
      shelfRedMat
    );
    signBoard.position.set(0, shelfHeight + 0.22, 0);
    rowGroup.add(signBoard);

    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1024;
    signCanvas.height = 128;
    const sCtx = signCanvas.getContext('2d')!;
    sCtx.fillStyle = '#991b1b';
    sCtx.fillRect(0, 0, 1024, 128);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 44px Inter, sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText(aisleTitle, 512, 64);

    const signTexture = new THREE.CanvasTexture(signCanvas);
    const signPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.68, 0.36),
      new THREE.MeshBasicMaterial({ map: signTexture })
    );
    signPlate.position.set(0, shelfHeight + 0.22, 0.04);
    rowGroup.add(signPlate);

    const signPlateBack = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.68, 0.36),
      new THREE.MeshBasicMaterial({ map: signTexture })
    );
    signPlateBack.position.set(0, shelfHeight + 0.22, -0.04);
    signPlateBack.rotation.y = Math.PI;
    rowGroup.add(signPlateBack);

    this.scene.add(rowGroup);

    // To'qnashuv
    const collider = new THREE.Box3();
    collider.setFromCenterAndSize(
      new THREE.Vector3(centerX, shelfHeight / 2, centerZ),
      new THREE.Vector3(shelfWidth + 0.6, shelfHeight, shelfDepth + 0.6)
    );
    this.shelfColliders.push(collider);

    // 6. MAHSULOTLARNI TOIFASI BO'YICHA ZICH VA TO'LA TERISH
    this.populateCategoryProducts(centerX, centerZ, tierHeights, categoryProducts, shelfWidth);
  }

  /**
   * Javonga FAQAT shu bo'limga tegishli mahsulotlarni qavatma-qavat tartibli terish
   */
  private populateCategoryProducts(
    centerX: number,
    centerZ: number,
    tierHeights: number[],
    products: ProductItem[],
    shelfWidth: number
  ): void {
    if (products.length === 0) return;

    const sides = [0.28, -0.28];
    const columnsCount = 10;
    const colStep = (shelfWidth - 1.0) / columnsCount;

    tierHeights.forEach((tierY, tierIdx) => {
      // Har bir qavatga bo'limdagi bitta mahsulot turi to'liq qator qilib teriladi!
      // Masalan: 1-qavat to'liq Pepsi, 2-qavat Cola, 3-qavat Fanta, 4-qavat Montella suv...
      const currentProduct = products[tierIdx % products.length];

      sides.forEach((sideZ) => {
        for (let col = 0; col < columnsCount; col++) {
          const posX = centerX - (shelfWidth - 1.0) / 2 + col * colStep + 0.45;
          const posZ = centerZ + sideZ;
          const spawnY = tierY + 0.02;

          const prodModel = ProductModelFactory.createProductModel(currentProduct);
          prodModel.position.set(posX, spawnY, posZ);

          if (sideZ < 0) {
            prodModel.rotation.y = Math.PI;
          }

          prodModel.userData = {
            productId: currentProduct.id,
            product: currentProduct,
          };

          prodModel.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.userData = {
                productId: currentProduct.id,
                product: currentProduct,
                parentGroup: prodModel,
              };
              this.clickableMeshes.push(child);
            }
          });

          this.scene.add(prodModel);

          // Masofadan ko'rinuvchi yorliq (har 2 ta mahsulotga bitta)
          if (col % 2 === 0) {
            this.labelManager.attachLabel(prodModel, currentProduct);
          }

          this.productMeshes.push({
            group: prodModel,
            product: currentProduct,
            originalY: spawnY,
          });

          // Chuqurlik bo'yicha orqasidagi zaxira nusxasi (javon liq to'la bo'lishi uchun)
          const depthOffset = sideZ > 0 ? -0.16 : 0.16;
          const backCopy = ProductModelFactory.createProductModel(currentProduct);
          backCopy.position.set(posX, spawnY, posZ + depthOffset);
          if (sideZ < 0) backCopy.rotation.y = Math.PI;
          this.scene.add(backCopy);
        }
      });
    });
  }

  public getClickableObjects(): THREE.Object3D[] {
    return this.clickableMeshes;
  }
}
