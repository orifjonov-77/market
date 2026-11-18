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
 * Haqiqiy KORZINKA Supermarketining parallel va to'liq oraliqli (Aisle) javonlar tizimi.
 * - Har bir javon ikki tomonlama (Double-Sided): old tomoni ham, orqa tomoni ham mahsulotlar bilan to'la!
 * - Javonlar orasidagi masofa keng (3.2 metr), odam bemalol aravacha bilan aylanib yuradi.
 * - Hech qanday bo'sh devor quti yo'q: Sut mahsulotlari ham xuddi boshqalaridek haqiqiy ochiq javonlarda turadi.
 * - Go'sht bo'limi to'g'ri o'rnatilgan.
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
    this.buildKorzinkaSupermarket();
  }

  private buildKorzinkaSupermarket(): void {
    const allProducts: ProductItem[] = productsData as ProductItem[];

    // Mahsulotlarni bo'limlar bo'yicha saralash
    const drinks = allProducts.filter((p) => p.category === 'ichimliklar');
    const sweets = allProducts.filter((p) => p.category === 'shirinliklar');
    const dairy = allProducts.filter((p) => p.category === 'sut_mahsulotlari');
    const grocery = allProducts.filter((p) => p.category === 'baqqollik');
    const meat = allProducts.filter((p) => p.category === 'gosht_muzlatilgan');
    const household = allProducts.filter((p) => p.category === 'maishiy_kimyo');
    const bakery = allProducts.filter((p) => p.category === 'non_pishiriqlar');
    const produce = allProducts.filter((p) => p.category === 'meva_sabzavot');

    // 4 TA ASOSIY PARALLEL QATOR (Keng yo'laklar: X oralig'i = 4.2 metr!)
    // 1-qator (X = -8.5): SHIRINLIKLAR & MAISHIY KIMYO
    this.createDoubleSidedAisle(-8.5, -4, 'SHIRINLIKLAR VA PECHYONELAR', sweets);
    this.createDoubleSidedAisle(-8.5, 6, 'MAISHIY KIMYO VA TOZALIK', household);

    // 2-qator (X = -3.5): SUT MAHSULOTLARI & NON-PISHIRIQLAR
    this.createDoubleSidedAisle(-3.5, -4, 'SUT VA SUT MAHSULOTLARI', dairy);
    this.createDoubleSidedAisle(-3.5, 6, 'YANGI NON VA PISHIRIQLAR', bakery);

    // 3-qator (X = 3.5): GO'SHT VA MUZLATILGAN & MEVA-SABZAVOT
    this.createDoubleSidedAisle(3.5, -4, 'GO\'SHT VA MUZLATILGAN MAHSULOTLAR', meat);
    this.createDoubleSidedAisle(3.5, 6, 'MEVA VA SABZAVOTLAR BO\'LIMI', produce);

    // 4-qator (X = 8.5): ICHIMLIKLAR & BAQQOLLIK
    this.createDoubleSidedAisle(8.5, -4, 'ICHIMLIKLAR VA SULAR', drinks);
    this.createDoubleSidedAisle(8.5, 6, 'BAQQOLLIK VA DON MAHSULOTLARI', grocery);
  }

  /**
   * IKKI TOMONLAMA (DOUBLE-SIDED) KORZINKA JAVONI:
   * Old tomoni ham (+Z), orqa tomoni ham (-Z) 100% to'la mahsulotlar bilan teriladi!
   */
  private createDoubleSidedAisle(
    centerX: number,
    centerZ: number,
    aisleTitle: string,
    products: ProductItem[]
  ): void {
    const shelfWidth = 8.0;
    const shelfHeight = 2.4;
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

    // 1. O'rtadagi orqa panel (Backing)
    const backPanel = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.04),
      shelfWhiteMat
    );
    backPanel.position.set(0, shelfHeight / 2, 0);
    backPanel.castShadow = true;
    rowGroup.add(backPanel);

    // 2. Qizil ustunlar (Stoykalar)
    const postGeo = new THREE.BoxGeometry(0.08, shelfHeight, 0.08);
    [-shelfWidth / 2, 0, shelfWidth / 2].forEach((x) => {
      const post = new THREE.Mesh(postGeo, shelfRedMat);
      post.position.set(x, shelfHeight / 2, 0);
      post.castShadow = true;
      rowGroup.add(post);
    });

    // 3. Pastki to'q qizil taglik (Podium)
    const basePodium = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth, 0.22, shelfDepth),
      shelfRedMat
    );
    basePodium.position.set(0, 0.11, 0);
    basePodium.castShadow = true;
    rowGroup.add(basePodium);

    // 4. JAVONNING 5 TA KATTA QAVATI
    const tierHeights = [0.22, 0.65, 1.1, 1.55, 2.0];
    const boardGeo = new THREE.BoxGeometry(shelfWidth, 0.04, shelfDepth);

    // Narx kanali teksturasi
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

    // 5. TEPASIDAGI QIZIL KORZINKA TABLICHKASI (Ikki tomonlama)
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
    sCtx.font = '900 44px "Arial Black", sans-serif';
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

    // To'qnashuv qutisi (Collision Box)
    const collider = new THREE.Box3();
    collider.setFromCenterAndSize(
      new THREE.Vector3(centerX, shelfHeight / 2, centerZ),
      new THREE.Vector3(shelfWidth + 0.4, shelfHeight, shelfDepth + 0.4)
    );
    this.shelfColliders.push(collider);

    // 6. MAHSULOTLARNI IKKALA TOMONGA HAM (OLD VA ORQA) ZICH TERISH
    this.populateBothSides(centerX, centerZ, tierHeights, shelfWidth, products);
  }

  /**
   * Javonning OLD (+Z) va ORQA (-Z) tomonlariga mahsulotlarni to'la qilib terish
   */
  private populateBothSides(
    centerX: number,
    centerZ: number,
    tierHeights: number[],
    shelfWidth: number,
    products: ProductItem[]
  ): void {
    if (products.length === 0) return;

    // Ikkala tomon: Old (+0.28) va Orqa (-0.28)
    const sides = [0.28, -0.28];
    const columnsCount = 15;
    const colStep = (shelfWidth - 0.8) / columnsCount;

    tierHeights.forEach((tierY, tierIdx) => {
      const currentProduct = products[tierIdx % products.length];

      sides.forEach((sideZ) => {
        for (let col = 0; col < columnsCount; col++) {
          const posX = centerX - (shelfWidth - 0.8) / 2 + col * colStep + colStep / 2;
          const posZ = centerZ + sideZ;
          const spawnY = tierY + 0.02;

          const prodModel = ProductModelFactory.createProductModel(currentProduct);
          prodModel.position.set(posX, spawnY, posZ);

          // Orqa tomondagi mahsulotlar tashqariga (-Z ga) qarab tursin
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

          // Har 3 tadan biriga narx/nom yorlig'i
          if (col % 3 === 0) {
            this.labelManager.attachLabel(prodModel, currentProduct);
          }

          this.productMeshes.push({
            group: prodModel,
            product: currentProduct,
            originalY: spawnY,
          });

          // Chuqurlik bo'yicha orqasidagi zaxira nusxasi (stok)
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
