import * as THREE from 'three';
import { ProductItem } from '../types';
import { LabelManager } from './labels';
import { ProductModelFactory } from './productFactory';

export interface InteractiveProduct {
  group: THREE.Group;
  product: ProductItem;
  originalY: number;
}

/**
 * Supermarketda xuddi rasmda ko'rsatganingizdek 2 TA KATTA MUSTAQIL JAVON QATORI:
 *
 * 1-JAVON (O'ng tomonda): "🛒 ICHIMLIKLAR VA SULAR 🛒"
 * 6-qavat: Nestlé Pure Life 1.5L
 * 5-qavat: Montella 1.5L
 * 4-qavat: Sprite 1.5L
 * 3-qavat: Fanta Orange 1.5L
 * 2-qavat: Coca-Cola 1.5L
 * 1-qavat: Pepsi 1.5L
 *
 * 2-JAVON (Chap tomonda): "🛒 SHIRINLIKLAR VA PECHYONELAR 🛒"
 * 6-qavat: Twix Xtra 75g
 * 5-qavat: Lotte Choco-Pie 12x
 * 4-qavat: Oreo Original 154g
 * 3-qavat: Nutella Pastasi 350g
 * 2-qavat: Milka Alpskiy 100g
 * 1-qavat: Snickers Super 80g
 *
 * Ikkala javon ham ikki tomonlama (old va orqasi to'la), bir-biriga yopishmagan,
 * o'rtada 8 metrli keng chiroyli supermarket yo'lagi bor!
 */
export class ShelvesManager {
  private scene: THREE.Scene;
  private labelManager: LabelManager;
  public shelfColliders: THREE.Box3[] = [];
  public productMeshes: InteractiveProduct[] = [];
  public clickableMeshes: THREE.Object3D[] = [];

  // 1-JAVON UCHUN ICHIMLIKLAR RO'YXATI (1-qavatdan 6-qavatgacha)
  private drinkProducts: ProductItem[] = [
    {
      id: 'pepsi_15',
      name: 'Pepsi 1.5L',
      category: 'ichimliklar',
      price: 13000,
      brand: 'pepsi',
      color: '#004b93',
      shape: 'bottle',
      size: { w: 0.22, h: 0.65, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'cola_15',
      name: 'Coca-Cola 1.5L',
      category: 'ichimliklar',
      price: 14000,
      brand: 'cola',
      color: '#e11d48',
      shape: 'bottle',
      size: { w: 0.22, h: 0.65, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'fanta_15',
      name: 'Fanta Orange 1.5L',
      category: 'ichimliklar',
      price: 13500,
      brand: 'fanta',
      color: '#ea580c',
      shape: 'bottle',
      size: { w: 0.22, h: 0.65, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'sprite_15',
      name: 'Sprite 1.5L',
      category: 'ichimliklar',
      price: 13500,
      brand: 'sprite',
      color: '#15803d',
      shape: 'bottle',
      size: { w: 0.22, h: 0.65, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'montella_15',
      name: 'Montella Suv 1.5L',
      category: 'ichimliklar',
      price: 4500,
      brand: 'montella',
      color: '#0284c7',
      shape: 'bottle',
      size: { w: 0.2, h: 0.62, d: 0.2 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'nestle_15',
      name: 'Nestlé Pure Life 1.5L',
      category: 'ichimliklar',
      price: 5000,
      brand: 'nestle',
      color: '#0072ce',
      shape: 'bottle',
      size: { w: 0.2, h: 0.62, d: 0.2 },
      korzinkaPlacement: 'ambient_shelf'
    }
  ];

  // 2-JAVON UCHUN SHIRINLIKLAR RO'YXATI (1-qavatdan 6-qavatgacha)
  private sweetProducts: ProductItem[] = [
    {
      id: 'snickers_80',
      name: 'Snickers Super 80g',
      category: 'shirinliklar',
      price: 9000,
      brand: 'snickers',
      color: '#381604',
      shape: 'box',
      size: { w: 0.38, h: 0.16, d: 0.18 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'milka_100',
      name: 'Milka Alpskiy 100g',
      category: 'shirinliklar',
      price: 16000,
      brand: 'milka',
      color: '#7c3aed',
      shape: 'box',
      size: { w: 0.38, h: 0.22, d: 0.18 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'nutella_350',
      name: 'Nutella Pastasi 350g',
      category: 'shirinliklar',
      price: 48000,
      brand: 'nutella',
      color: '#ffffff',
      shape: 'can',
      size: { w: 0.28, h: 0.32, d: 0.28 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'oreo_154',
      name: 'Oreo Pechyoniyasi 154g',
      category: 'shirinliklar',
      price: 11500,
      brand: 'oreo',
      color: '#0072ce',
      shape: 'box',
      size: { w: 0.38, h: 0.24, d: 0.18 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'chocopie_12',
      name: 'Lotte Choco-Pie 12x',
      category: 'shirinliklar',
      price: 27000,
      brand: 'chocopie',
      color: '#b91c1c',
      shape: 'box',
      size: { w: 0.42, h: 0.26, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'twix_75',
      name: 'Twix Xtra 75g',
      category: 'shirinliklar',
      price: 9000,
      brand: 'twix',
      color: '#f59e0b',
      shape: 'box',
      size: { w: 0.38, h: 0.18, d: 0.18 },
      korzinkaPlacement: 'ambient_shelf'
    }
  ];

  constructor(scene: THREE.Scene, labelManager: LabelManager) {
    this.scene = scene;
    this.labelManager = labelManager;
    this.buildTwoStandaloneAisles();
  }

  /**
   * O'tgan safargidek 2 TA KATTA ALOHIDA JAVON (Bir-biriga yopishmagan, toza va keng)
   */
  private buildTwoStandaloneAisles(): void {
    // 1-JAVON (O'ng tomonda X = 5): ICHIMLIKLAR VA SULAR
    this.createPhotoExactShelf(5, 0, 'ICHIMLIKLAR VA SULAR', this.drinkProducts);

    // 2-JAVON (Chap tomonda X = -5): SHIRINLIKLAR VA PECHYONELAR
    this.createPhotoExactShelf(-5, 0, 'SHIRINLIKLAR VA PECHYONELAR', this.sweetProducts);
  }

  /**
   * Rasmdagi kabi 6 qavatli mustaqil javon
   */
  private createPhotoExactShelf(
    centerX: number,
    centerZ: number,
    aisleTitle: string,
    tierProductList: ProductItem[]
  ): void {
    const shelfWidth = 10.0;
    const shelfHeight = 2.6;
    const shelfDepth = 1.0;

    const shelfRedMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.35,
      metalness: 0.2,
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

    // 2. Qizil ustunlar (Stoykalar)
    const postGeo = new THREE.BoxGeometry(0.08, shelfHeight, 0.08);
    [-shelfWidth / 2, -shelfWidth / 6, shelfWidth / 6, shelfWidth / 2].forEach((x) => {
      const post = new THREE.Mesh(postGeo, shelfRedMat);
      post.position.set(x, shelfHeight / 2, 0);
      post.castShadow = true;
      rowGroup.add(post);
    });

    // 3. Pastki to'q qizil taglik
    const basePodium = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth, 0.22, shelfDepth),
      shelfRedMat
    );
    basePodium.position.set(0, 0.11, 0);
    basePodium.castShadow = true;
    rowGroup.add(basePodium);

    // 4. JAVONNING 6 TA QAVATI
    const tierHeights = [0.22, 0.62, 1.02, 1.42, 1.82, 2.22];
    const boardGeo = new THREE.BoxGeometry(shelfWidth, 0.04, shelfDepth);

    // Narx kanali
    const tagCanvas = document.createElement('canvas');
    tagCanvas.width = 512;
    tagCanvas.height = 32;
    const tCtx = tagCanvas.getContext('2d')!;
    tCtx.fillStyle = '#991b1b';
    tCtx.fillRect(0, 0, 512, 32);
    tCtx.fillStyle = '#ffffff';
    for (let tx = 8; tx < 500; tx += 48) {
      tCtx.fillRect(tx, 4, 38, 24);
    }
    const tagTex = new THREE.CanvasTexture(tagCanvas);
    tagTex.wrapS = THREE.RepeatWrapping;
    tagTex.repeat.set(10, 1);
    const tagMat = new THREE.MeshBasicMaterial({ map: tagTex });

    tierHeights.forEach((tierY) => {
      const board = new THREE.Mesh(boardGeo, shelfWhiteMat);
      board.position.set(0, tierY, 0);
      board.receiveShadow = true;
      rowGroup.add(board);

      // Old narx kanali (+Z)
      const frontEdge = new THREE.Mesh(
        new THREE.BoxGeometry(shelfWidth, 0.05, 0.03),
        tagMat
      );
      frontEdge.position.set(0, tierY + 0.02, shelfDepth / 2 + 0.01);
      rowGroup.add(frontEdge);

      // Orqa narx kanali (-Z)
      const backEdge = new THREE.Mesh(
        new THREE.BoxGeometry(shelfWidth, 0.05, 0.03),
        tagMat
      );
      backEdge.position.set(0, tierY + 0.02, -shelfDepth / 2 - 0.01);
      rowGroup.add(backEdge);

      // Old xrom sim
      const wireGeo = new THREE.CylinderGeometry(0.005, 0.005, shelfWidth, 8);
      const wireFront = new THREE.Mesh(wireGeo, wireMat);
      wireFront.rotation.z = Math.PI / 2;
      wireFront.position.set(0, tierY + 0.065, shelfDepth / 2 + 0.015);
      rowGroup.add(wireFront);

      // Orqa xrom sim
      const wireBack = new THREE.Mesh(wireGeo, wireMat);
      wireBack.rotation.z = Math.PI / 2;
      wireBack.position.set(0, tierY + 0.065, -shelfDepth / 2 - 0.015);
      rowGroup.add(wireBack);
    });

    // 5. TEPADAGI KATTA QIZIL TABLICHKA (Ikki tomonlama)
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth * 0.74, 0.44, 0.06),
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
    sCtx.strokeStyle = '#ffffff';
    sCtx.lineWidth = 4;
    sCtx.strokeRect(10, 10, 1004, 108);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = '900 46px "Arial Black", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText(`🛒   ${aisleTitle}   🛒`, 512, 64);

    const signTexture = new THREE.CanvasTexture(signCanvas);
    const signPlateFront = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.72, 0.4),
      new THREE.MeshBasicMaterial({ map: signTexture })
    );
    signPlateFront.position.set(0, shelfHeight + 0.22, 0.04);
    rowGroup.add(signPlateFront);

    const signPlateBack = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.72, 0.4),
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
      new THREE.Vector3(shelfWidth + 0.4, shelfHeight, shelfDepth + 0.4)
    );
    this.shelfColliders.push(collider);

    // 6. MAHSULOTLARNI OLDIGA HAM, ORQASIGA HAM TO'LIQ TERISH
    this.populateBothSides(centerX, centerZ, tierHeights, shelfWidth, tierProductList);
  }

  private populateBothSides(
    centerX: number,
    centerZ: number,
    tierHeights: number[],
    shelfWidth: number,
    productList: ProductItem[]
  ): void {
    // Old (+0.28) va Orqa (-0.28) tomonlar
    const sides = [0.28, -0.28];
    const columnsCount = 18; // Har bir qavatda 18 tadan mahsulot
    const colStep = (shelfWidth - 0.8) / columnsCount;

    tierHeights.forEach((tierY, tierIdx) => {
      // 0 dan 5 gacha qavatlar bo'yicha mahsulot
      const currentProduct = productList[tierIdx];

      sides.forEach((sideZ) => {
        for (let col = 0; col < columnsCount; col++) {
          const posX = centerX - (shelfWidth - 0.8) / 2 + col * colStep + colStep / 2;
          const posZ = centerZ + sideZ;
          const spawnY = tierY + 0.02;

          const prodModel = ProductModelFactory.createProductModel(currentProduct);
          prodModel.position.set(posX, spawnY, posZ);

          // Orqa tomondagilarni tashqariga qaratish
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

          // Har 3 tadan biriga yorliq
          if (col % 3 === 0) {
            this.labelManager.attachLabel(prodModel, currentProduct);
          }

          this.productMeshes.push({
            group: prodModel,
            product: currentProduct,
            originalY: spawnY,
          });

          // Orqadagi zaxira stoki (hech qanday bo'shliq qolmasligi uchun)
          const depthOffset = sideZ > 0 ? -0.14 : 0.14;
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
