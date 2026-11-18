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
 * Haqiqiy KORZINKA Supermarketining to'liq 8 ta bo'limini quruvchi arxitektura:
 *
 * 1. Ichimliklar va Sular (Nestle, Montella, Sprite, Fanta, Cola, Pepsi)
 * 2. Shirinliklar va Pechyonelar (Twix, Choco-Pie, Oreo, Nutella, Milka, Snickers, KitKat)
 * 3. Sut Mahsulotlari va Muzlatgich Sovutgichlari (Kamilka, Musaffo, Kefir, Smetana, Sariyog', Pishloq)
 * 4. Non va Yangi Pishiriqlar (Samarqand non, Yog'li patir, Kruassan, Baget)
 * 5. Meva va Sabzavotlar (Yashil yog'och yashiklar, olma, banan, apelsin, kartoshka, pomidor, bodring)
 * 6. Go'sht va Muzlatilgan Mahsulotlar (Sovutkichli orol freezers, tovuq, mol go'shti, chuchvara)
 * 7. Baqqollik va Don Mahsulotlari (Yog', guruch, makaron, choy, kofe, un, konserva)
 * 8. Maishiy Kimyo va Tozalik (Tide, Fairy, Domestos, Papia)
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

    // 1. O'ng qatordagi Javonlar
    const drinks = allProducts.filter((p) => p.category === 'ichimliklar');
    this.createKorzinkaShelfAisle(8, -6, 'ICHIMLIKLAR VA SULAR', drinks);

    const grocery = allProducts.filter((p) => p.category === 'baqqollik');
    this.createKorzinkaShelfAisle(8, 6, 'BAQQOLLIK VA MAHSULOTLAR', grocery);

    // 2. Chap qatordagi Javonlar
    const sweets = allProducts.filter((p) => p.category === 'shirinliklar');
    this.createKorzinkaShelfAisle(-8, -6, 'SHIRINLIKLAR VA PECHYONELAR', sweets);

    const household = allProducts.filter((p) => p.category === 'maishiy_kimyo');
    this.createKorzinkaShelfAisle(-8, 6, 'MAISHIY KIMYO VA TOZALIK', household);

    // 3. Maxsus Sovutkichli Sut Bo'limi (Chilled Fridge Row - Orqa devor bo'ylab)
    const dairy = allProducts.filter((p) => p.category === 'sut_mahsulotlari');
    this.createChilledDairyFridge(0, -14, 'SUT VA QATTIQ MAHSULOTLARI', dairy);

    // 4. Muzlatgich Orollari (Island Freezers - Markazda)
    const frozen = allProducts.filter((p) => p.category === 'gosht_muzlatilgan');
    this.createIslandFreezers(0, 0, 'MUZLATILGAN GO\'SHT VA MAHSULOTLAR', frozen);

    // 5. Meva va Sabzavotlar Oroli (Produce Market Crates - Kirishda)
    const produce = allProducts.filter((p) => p.category === 'meva_sabzavot');
    this.createProduceIsland(0, 8, 'MEVA VA SABZAVOTLAR', produce);

    // 6. Non va Yangi Pishiriqlar (Bakery wooden stands - Chap orqada)
    const bakery = allProducts.filter((p) => p.category === 'non_pishiriqlar');
    this.createBakeryStands(-14, 0, 'YANGI NON VA PISHIRIQLAR', bakery);
  }

  /**
   * STANDART 6 QAVATLI KORZINKA JAVONI (Rasmga 100% mos to'q qizil karkas)
   */
  private createKorzinkaShelfAisle(
    centerX: number,
    centerZ: number,
    aisleTitle: string,
    products: ProductItem[]
  ): void {
    const shelfWidth = 9.0;
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

    // Orqa oq panel
    const backPanel = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.04),
      shelfWhiteMat
    );
    backPanel.position.set(0, shelfHeight / 2, 0);
    backPanel.castShadow = true;
    rowGroup.add(backPanel);

    // Vertikal qizil ustunlar
    const postGeo = new THREE.BoxGeometry(0.08, shelfHeight, 0.08);
    [-shelfWidth / 2, -shelfWidth / 6, shelfWidth / 6, shelfWidth / 2].forEach((x) => {
      const post = new THREE.Mesh(postGeo, shelfRedMat);
      post.position.set(x, shelfHeight / 2, 0);
      post.castShadow = true;
      rowGroup.add(post);
    });

    // Pastki to'q qizil taglik
    const basePodium = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth, 0.22, shelfDepth),
      shelfRedMat
    );
    basePodium.position.set(0, 0.11, 0);
    basePodium.castShadow = true;
    rowGroup.add(basePodium);

    // 6 ta qavat
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

    // Korzinka uslubidagi qizil tablichka
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
    const signPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.72, 0.4),
      new THREE.MeshBasicMaterial({ map: signTexture })
    );
    signPlate.position.set(0, shelfHeight + 0.22, 0.04);
    rowGroup.add(signPlate);

    const signPlateBack = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.72, 0.4),
      new THREE.MeshBasicMaterial({ map: signTexture })
    );
    signPlateBack.position.set(0, shelfHeight + 0.22, -0.04);
    signPlateBack.rotation.y = Math.PI;
    rowGroup.add(signPlateBack);

    this.scene.add(rowGroup);

    const collider = new THREE.Box3();
    collider.setFromCenterAndSize(
      new THREE.Vector3(centerX, shelfHeight / 2, centerZ),
      new THREE.Vector3(shelfWidth + 0.6, shelfHeight, shelfDepth + 0.6)
    );
    this.shelfColliders.push(collider);

    // Mahsulotlarni qavatma-qavat terish
    this.populateProductsOnTiers(centerX, centerZ, tierHeights, shelfWidth, products, 16);
  }

  /**
   * SUT VA QATTIQ MAHSULOTLAR UCHUN SOVUTKICH (Glass Chilled Refrigerator)
   */
  private createChilledDairyFridge(
    centerX: number,
    centerZ: number,
    title: string,
    products: ProductItem[]
  ): void {
    const fridgeWidth = 10.0;
    const fridgeHeight = 2.6;
    const fridgeDepth = 1.1;

    const fridgeGroup = new THREE.Group();
    fridgeGroup.position.set(centerX, 0, centerZ);

    // Oq sovutkich korpusi
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(fridgeWidth, fridgeHeight, fridgeDepth),
      bodyMat
    );
    body.position.set(0, fridgeHeight / 2, 0);
    fridgeGroup.add(body);

    // Old shaffof oynali eshiklar
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
    });
    const glassDoor = new THREE.Mesh(
      new THREE.BoxGeometry(fridgeWidth * 0.96, fridgeHeight * 0.85, 0.02),
      glassMat
    );
    glassDoor.position.set(0, fridgeHeight * 0.48, fridgeDepth / 2 + 0.01);
    fridgeGroup.add(glassDoor);

    // Moviy sovutish LED nuri
    const fridgeLight = new THREE.PointLight(0x38bdf8, 0.8, 8);
    fridgeLight.position.set(0, fridgeHeight * 0.7, fridgeDepth / 2);
    fridgeGroup.add(fridgeLight);

    // Sovutkich tepasidagi tablichka
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(fridgeWidth * 0.7, 0.4, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x0284c7 })
    );
    signBoard.position.set(0, fridgeHeight + 0.2, 0);
    fridgeGroup.add(signBoard);

    this.scene.add(fridgeGroup);

    const collider = new THREE.Box3();
    collider.setFromCenterAndSize(
      new THREE.Vector3(centerX, fridgeHeight / 2, centerZ),
      new THREE.Vector3(fridgeWidth + 0.5, fridgeHeight, fridgeDepth + 0.5)
    );
    this.shelfColliders.push(collider);

    const tierHeights = [0.25, 0.7, 1.15, 1.6, 2.05];
    this.populateProductsOnTiers(centerX, centerZ, tierHeights, fridgeWidth, products, 14);
  }

  /**
   * MUZLATILGAN GO'SHT VA MAXSULOTLAR UCHUN OROL SOVUTGICHLAR (Island Freezers)
   */
  private createIslandFreezers(
    centerX: number,
    centerZ: number,
    title: string,
    products: ProductItem[]
  ): void {
    const freezerWidth = 6.0;
    const freezerHeight = 0.95;
    const freezerDepth = 2.0;

    const freezerGroup = new THREE.Group();
    freezerGroup.position.set(centerX, 0, centerZ);

    // Pastki kumush metall korpus
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.6, roughness: 0.3 });
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(freezerWidth, freezerHeight, freezerDepth),
      baseMat
    );
    base.position.set(0, freezerHeight / 2, 0);
    freezerGroup.add(base);

    // Ustki suriluvchi shisha qopqoqlar
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
    });
    const glassCover = new THREE.Mesh(
      new THREE.BoxGeometry(freezerWidth * 0.95, 0.04, freezerDepth * 0.95),
      glassMat
    );
    glassCover.position.set(0, freezerHeight + 0.02, 0);
    freezerGroup.add(glassCover);

    // Muzdek ko'k nur
    const fLight = new THREE.PointLight(0x0284c7, 0.7, 6);
    fLight.position.set(0, freezerHeight + 0.3, 0);
    freezerGroup.add(fLight);

    this.scene.add(freezerGroup);

    const collider = new THREE.Box3();
    collider.setFromCenterAndSize(
      new THREE.Vector3(centerX, freezerHeight / 2, centerZ),
      new THREE.Vector3(freezerWidth + 0.5, freezerHeight, freezerDepth + 0.5)
    );
    this.shelfColliders.push(collider);

    // Muzlatgich ustiga mahsulotlarni qator terish
    products.forEach((prod, i) => {
      for (let c = 0; c < 5; c++) {
        const px = centerX - 2.2 + c * 1.1;
        const pz = centerZ - 0.6 + (i % 2) * 1.2;
        const m = ProductModelFactory.createProductModel(prod);
        m.position.set(px, freezerHeight + 0.04, pz);
        m.userData = { productId: prod.id, product: prod };

        m.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.userData = { productId: prod.id, product: prod, parentGroup: m };
            this.clickableMeshes.push(child);
          }
        });

        this.scene.add(m);
        if (c === 2) this.labelManager.attachLabel(m, prod);
        this.productMeshes.push({ group: m, product: prod, originalY: freezerHeight + 0.04 });
      }
    });
  }

  /**
   * MEVA VA SABZAVOTLAR OROLI (Yog'och yashiklar)
   */
  private createProduceIsland(
    centerX: number,
    centerZ: number,
    title: string,
    products: ProductItem[]
  ): void {
    const islandWidth = 6.0;
    const islandHeight = 1.0;
    const islandDepth = 2.2;

    const islandGroup = new THREE.Group();
    islandGroup.position.set(centerX, 0, centerZ);

    // Tabiiy yog'och stend
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const woodBase = new THREE.Mesh(
      new THREE.BoxGeometry(islandWidth, islandHeight, islandDepth),
      woodMat
    );
    woodBase.position.set(0, islandHeight / 2, 0);
    islandGroup.add(woodBase);

    this.scene.add(islandGroup);

    const collider = new THREE.Box3();
    collider.setFromCenterAndSize(
      new THREE.Vector3(centerX, islandHeight / 2, centerZ),
      new THREE.Vector3(islandWidth + 0.5, islandHeight, islandDepth + 0.5)
    );
    this.shelfColliders.push(collider);

    // Yashiklardagi meva va sabzavotlar
    products.forEach((prod, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const px = centerX - 1.8 + col * 1.8;
      const pz = centerZ - 0.5 + row * 1.0;

      for (let n = 0; n < 4; n++) {
        const m = ProductModelFactory.createProductModel(prod);
        const ox = (n % 2) * 0.3 - 0.15;
        const oz = Math.floor(n / 2) * 0.3 - 0.15;
        m.position.set(px + ox, islandHeight + 0.02, pz + oz);
        m.userData = { productId: prod.id, product: prod };

        m.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.userData = { productId: prod.id, product: prod, parentGroup: m };
            this.clickableMeshes.push(child);
          }
        });

        this.scene.add(m);
        if (n === 0) this.labelManager.attachLabel(m, prod);
        this.productMeshes.push({ group: m, product: prod, originalY: islandHeight + 0.02 });
      }
    });
  }

  /**
   * NON VA PISHIRIQLAR UCHUN YOG'OCH JAVONLAR (Bakery Wooden Stands)
   */
  private createBakeryStands(
    centerX: number,
    centerZ: number,
    title: string,
    products: ProductItem[]
  ): void {
    const standWidth = 7.0;
    const standHeight = 2.4;
    const standDepth = 0.9;

    const standGroup = new THREE.Group();
    standGroup.position.set(centerX, 0, centerZ);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75 });
    const back = new THREE.Mesh(new THREE.BoxGeometry(standWidth, standHeight, 0.05), woodMat);
    back.position.set(0, standHeight / 2, 0);
    standGroup.add(back);

    const levels = [0.3, 0.85, 1.4, 1.95];
    levels.forEach((lvl) => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(standWidth, 0.05, standDepth), woodMat);
      shelf.position.set(0, lvl, standDepth / 2);
      standGroup.add(shelf);
    });

    this.scene.add(standGroup);

    const collider = new THREE.Box3();
    collider.setFromCenterAndSize(
      new THREE.Vector3(centerX, standHeight / 2, centerZ + standDepth / 2),
      new THREE.Vector3(standWidth + 0.5, standHeight, standDepth + 0.5)
    );
    this.shelfColliders.push(collider);

    this.populateProductsOnTiers(centerX, centerZ + standDepth / 2, levels, standWidth, products, 10);
  }

  /**
   * Qavatlar bo'ylab mahsulotlarni bir tekis terish
   */
  private populateProductsOnTiers(
    centerX: number,
    centerZ: number,
    tierHeights: number[],
    shelfWidth: number,
    productList: ProductItem[],
    columnsCount: number
  ): void {
    if (productList.length === 0) return;
    const colStep = (shelfWidth - 0.8) / columnsCount;

    tierHeights.forEach((tierY, tierIdx) => {
      const currentProduct = productList[tierIdx % productList.length];

      for (let col = 0; col < columnsCount; col++) {
        const posX = centerX - (shelfWidth - 0.8) / 2 + col * colStep + colStep / 2;
        const posZ = centerZ + 0.25;
        const spawnY = tierY + 0.02;

        const prodModel = ProductModelFactory.createProductModel(currentProduct);
        prodModel.position.set(posX, spawnY, posZ);

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

        if (col % 4 === 0) {
          this.labelManager.attachLabel(prodModel, currentProduct);
        }

        this.productMeshes.push({
          group: prodModel,
          product: currentProduct,
          originalY: spawnY,
        });

        // Zaxira qator
        const backCopy = ProductModelFactory.createProductModel(currentProduct);
        backCopy.position.set(posX, spawnY, posZ - 0.16);
        this.scene.add(backCopy);
      }
    });
  }

  public getClickableObjects(): THREE.Object3D[] {
    return this.clickableMeshes;
  }
}
