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
 * Supermarket javonlarini 2-rasmga 100% bir xil qilib quruvchi klass:
 *
 * Rasmdagi qat'iy qavatlar taqsimoti:
 * 6-qavat (eng yuqori): Nestlé Pure Life 1.5L (shaffof suv, ko'k to'lqinli qalin etiketka)
 * 5-qavat:              Montella 1.5L (toza oq/kumushrang etiketka, shaffof suv)
 * 4-qavat:              Sprite 1.5L (yashil shaffof shisha, yashil-sariq etiketka)
 * 3-qavat:              Fanta Orange 1.5L (apelsin suyuqlik, yorqin to'q sariq shisha)
 * 2-qavat:              Coca-Cola 1.5L (qora kola suyuqligi, qizil etiketka)
 * 1-qavat (eng pastki): Pepsi 1.5L (qora kola suyuqligi, moviy etiketka, Pepsi globusi)
 */
export class ShelvesManager {
  private scene: THREE.Scene;
  private labelManager: LabelManager;
  public shelfColliders: THREE.Box3[] = [];
  public productMeshes: InteractiveProduct[] = [];
  public clickableMeshes: THREE.Object3D[] = [];

  // Rasmdagi 6 ta qavatga mos 6 ta mahsulot (yuqoridan pastga)
  private aisleProducts: ProductItem[] = [
    {
      id: 'pepsi_15',
      name: 'Pepsi 1.5L',
      category: 'ichimliklar',
      price: 13000,
      brand: 'pepsi',
      color: '#004b93',
      shape: 'bottle',
      size: { w: 0.22, h: 0.65, d: 0.22 }
    },
    {
      id: 'cola_15',
      name: 'Coca-Cola 1.5L',
      category: 'ichimliklar',
      price: 14000,
      brand: 'cola',
      color: '#e11d48',
      shape: 'bottle',
      size: { w: 0.22, h: 0.65, d: 0.22 }
    },
    {
      id: 'fanta_15',
      name: 'Fanta Orange 1.5L',
      category: 'ichimliklar',
      price: 13500,
      brand: 'fanta',
      color: '#ea580c',
      shape: 'bottle',
      size: { w: 0.22, h: 0.65, d: 0.22 }
    },
    {
      id: 'sprite_15',
      name: 'Sprite 1.5L',
      category: 'ichimliklar',
      price: 13500,
      brand: 'sprite',
      color: '#15803d',
      shape: 'bottle',
      size: { w: 0.22, h: 0.65, d: 0.22 }
    },
    {
      id: 'montella_15',
      name: 'Montella Suv 1.5L',
      category: 'ichimliklar',
      price: 4500,
      brand: 'montella',
      color: '#0284c7',
      shape: 'bottle',
      size: { w: 0.2, h: 0.62, d: 0.2 }
    },
    {
      id: 'nestle_15',
      name: 'Nestlé Pure Life 1.5L',
      category: 'ichimliklar',
      price: 5000,
      brand: 'nestle',
      color: '#0072ce',
      shape: 'bottle',
      size: { w: 0.2, h: 0.62, d: 0.2 }
    }
  ];

  constructor(scene: THREE.Scene, labelManager: LabelManager) {
    this.scene = scene;
    this.labelManager = labelManager;
    this.buildSupermarketRows();
  }

  private buildSupermarketRows(): void {
    // Rasmdagi markaziy qator: ICHIMLIKLAR VA SULAR
    this.createPhotoExactAisle(0, 0, 'ICHIMLIKLAR VA SULAR');

    // Qo'shimcha yon qatorlar (Supermarket to'liqligi uchun)
    this.createPhotoExactAisle(-7, -2, 'ICHIMLIKLAR VA SULAR');
    this.createPhotoExactAisle(7, -2, 'ICHIMLIKLAR VA SULAR');
  }

  /**
   * 2-rasmga 100% bir xil javon tizimi
   */
  private createPhotoExactAisle(centerX: number, centerZ: number, aisleTitle: string): void {
    const shelfWidth = 10.0;
    const shelfHeight = 2.6;
    const shelfDepth = 1.0;

    // Rasmdagi to'q qizil supermarket karkasi
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

    // 2. Vertikal qizil ustunlar (rasmda 4 ta bo'lim / seksiyani ajratib turuvchi stoykalar)
    const postGeo = new THREE.BoxGeometry(0.08, shelfHeight, 0.08);
    const postXs = [-shelfWidth / 2, -shelfWidth / 6, shelfWidth / 6, shelfWidth / 2];
    postXs.forEach((x) => {
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

    // 4. JAVONNING 6 TA QAVATI (Rasmdagidek bir tekis balandliklar)
    const tierHeights = [0.22, 0.62, 1.02, 1.42, 1.82, 2.22];
    const boardGeo = new THREE.BoxGeometry(shelfWidth, 0.04, shelfDepth);

    // Oq narx qog'ozchali qizil profil
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
      // Taxta
      const board = new THREE.Mesh(boardGeo, shelfWhiteMat);
      board.position.set(0, tierY, 0);
      board.receiveShadow = true;
      rowGroup.add(board);

      // Old qizil narx profili
      const frontEdge = new THREE.Mesh(
        new THREE.BoxGeometry(shelfWidth, 0.05, 0.03),
        tagMat
      );
      frontEdge.position.set(0, tierY + 0.02, shelfDepth / 2 + 0.01);
      rowGroup.add(frontEdge);

      const backEdge = new THREE.Mesh(
        new THREE.BoxGeometry(shelfWidth, 0.05, 0.03),
        tagMat
      );
      backEdge.position.set(0, tierY + 0.02, -shelfDepth / 2 - 0.01);
      rowGroup.add(backEdge);

      // Xrom sim to'siq
      const wireGeo = new THREE.CylinderGeometry(0.005, 0.005, shelfWidth, 8);
      const wireFront = new THREE.Mesh(wireGeo, wireMat);
      wireFront.rotation.z = Math.PI / 2;
      wireFront.position.set(0, tierY + 0.065, shelfDepth / 2 + 0.015);
      rowGroup.add(wireFront);

      const wireBack = new THREE.Mesh(wireGeo, wireMat);
      wireBack.rotation.z = Math.PI / 2;
      wireBack.position.set(0, tierY + 0.065, -shelfDepth / 2 - 0.015);
      rowGroup.add(wireBack);
    });

    // 5. Rasm tepasidagi QIZIL KATTA TABLICHKA: "🛒 ICHIMLIKLAR VA SULAR 🛒"
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth * 0.72, 0.44, 0.06),
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

    // Oq ramka
    sCtx.strokeStyle = '#ffffff';
    sCtx.lineWidth = 4;
    sCtx.strokeRect(10, 10, 1004, 108);

    // Savatcha ikonkalari va "ICHIMLIKLAR VA SULAR"
    sCtx.fillStyle = '#ffffff';
    sCtx.font = '900 48px "Arial Black", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('🛒   ICHIMLIKLAR VA SULAR   🛒', 512, 64);

    const signTexture = new THREE.CanvasTexture(signCanvas);
    const signPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.7, 0.4),
      new THREE.MeshBasicMaterial({ map: signTexture })
    );
    signPlate.position.set(0, shelfHeight + 0.22, 0.04);
    rowGroup.add(signPlate);

    const signPlateBack = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.7, 0.4),
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

    // 6. MAHSULOTLARNI RASMGA 100% BIR XIL TERISH (QAVATMA-QAVAT)
    this.populatePhotoRows(centerX, centerZ, tierHeights, shelfWidth);
  }

  /**
   * 🎯 Rasmdagi kabi har bir qavat bo'ylab to'liq qator qilib terish:
   * tierHeights[0] (1-qavat): Pepsi 1.5L
   * tierHeights[1] (2-qavat): Coca-Cola 1.5L
   * tierHeights[2] (3-qavat): Fanta Orange 1.5L
   * tierHeights[3] (4-qavat): Sprite 1.5L
   * tierHeights[4] (5-qavat): Montella 1.5L
   * tierHeights[5] (6-qavat): Nestlé Pure Life 1.5L
   */
  private populatePhotoRows(
    centerX: number,
    centerZ: number,
    tierHeights: number[],
    shelfWidth: number
  ): void {
    const sides = [0.28, -0.28];
    const columnsCount = 20; // Rasmda ko'ringanidek qatorda ko'p va zich (20 ta shisha)
    const colStep = (shelfWidth - 0.8) / columnsCount;

    tierHeights.forEach((tierY, tierIdx) => {
      // Qaysi mahsulot turi (0: Pepsi, 1: Cola, 2: Fanta, 3: Sprite, 4: Montella, 5: Nestle)
      const currentProduct = this.aisleProducts[tierIdx];

      sides.forEach((sideZ) => {
        for (let col = 0; col < columnsCount; col++) {
          const posX = centerX - (shelfWidth - 0.8) / 2 + col * colStep + colStep / 2;
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

          // Har 3 ta shishadan biriga narx/nom yorlig'i
          if (col % 3 === 0) {
            this.labelManager.attachLabel(prodModel, currentProduct);
          }

          this.productMeshes.push({
            group: prodModel,
            product: currentProduct,
            originalY: spawnY,
          });

          // Orqadagi to'ldiruvchi 2-qator (zaxira shisha)
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
