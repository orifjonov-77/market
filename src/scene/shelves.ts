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
 * Supermarketda 2 ta katta oroli (Gondola), har birida 2 tadan tomon (jami 4 ta mustaqil javon):
 *
 * 1-OROL (Z = -3.5 da):
 * - OLD TOMONI (+Z): "SHIRINLIKLAR VA PECHYONELAR" (Twix, Choco-Pie, Oreo, Nutella, Milka, Snickers)
 * - ORQA TOMONI (-Z): "ICHIMLIKLAR VA SULAR" (Nestle, Montella, Sprite, Fanta, Cola, Pepsi)
 *
 * 2-OROL (Z = 3.5 da):
 * - OLD TOMONI (+Z): "KONSERVA VA BALIQ MAHSULOTLARI" (Tunes, Sardina, Bonduelle jo'xori, no'xat, zaytun, bodring)
 * - ORQA TOMONI (-Z): "SUT VA SUT MAHSULOTLARI" (Kamilka sut, Musaffo, Kefir, Smetana, Président sariyog', Golland pishloq)
 *
 * O'rtasida 7 metrli keng chiroyli yo'lak bor, har bir bo'lim o'zining tepadagi qizil tablichkasi bilan ko'rinadi!
 */
export class ShelvesManager {
  private scene: THREE.Scene;
  private labelManager: LabelManager;
  public shelfColliders: THREE.Box3[] = [];
  public productMeshes: InteractiveProduct[] = [];
  public clickableMeshes: THREE.Object3D[] = [];

  // 1. SHIRINLIKLAR
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

  // 2. ICHIMLIKLAR VA SULAR
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

  // 3. KONSERVALAR VA BALIQ
  private cannedProducts: ProductItem[] = [
    {
      id: 'canned_tuna',
      name: 'Tunes Tuna Baliq Konservasi 185g',
      category: 'konserva',
      price: 24000,
      brand: 'tuna',
      color: '#0284c7',
      shape: 'can',
      size: { w: 0.26, h: 0.18, d: 0.26 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'canned_sardine',
      name: 'Sardina Moydagi Baliq 240g',
      category: 'konserva',
      price: 21000,
      brand: 'sardine',
      color: '#0f172a',
      shape: 'can',
      size: { w: 0.26, h: 0.18, d: 0.26 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'canned_corn',
      name: 'Bonduelle Shirin Jo\'xori 340g',
      category: 'konserva',
      price: 18000,
      brand: 'corn',
      color: '#15803d',
      shape: 'can',
      size: { w: 0.24, h: 0.3, d: 0.24 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'canned_peas',
      name: 'Bonduelle Yashil No\'xat 400g',
      category: 'konserva',
      price: 17500,
      brand: 'peas',
      color: '#15803d',
      shape: 'can',
      size: { w: 0.24, h: 0.3, d: 0.24 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'canned_olives',
      name: 'Qora Zaytun 300g',
      category: 'konserva',
      price: 22000,
      brand: 'olives',
      color: '#1e293b',
      shape: 'can',
      size: { w: 0.24, h: 0.32, d: 0.24 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'canned_pickles',
      name: 'Tuzlangan Bodring 720g',
      category: 'konserva',
      price: 19000,
      brand: 'pickles',
      color: '#14532d',
      shape: 'can',
      size: { w: 0.26, h: 0.42, d: 0.26 },
      korzinkaPlacement: 'ambient_shelf'
    }
  ];

  // 4. SUT MAHSULOTLARI
  private dairyProducts: ProductItem[] = [
    {
      id: 'dairy_kamilka',
      name: 'Kamilka Sut 3.2% 1L',
      category: 'sut_mahsulotlari',
      price: 12000,
      brand: 'milk_kamilka',
      color: '#0284c7',
      shape: 'box',
      size: { w: 0.26, h: 0.52, d: 0.2 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'dairy_musaffo',
      name: 'Musaffo Sut 2.5% 1L',
      category: 'sut_mahsulotlari',
      price: 11500,
      brand: 'milk_musaffo',
      color: '#2563eb',
      shape: 'box',
      size: { w: 0.26, h: 0.52, d: 0.2 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'dairy_kefir',
      name: 'Bio Kefir 1% 1L',
      category: 'sut_mahsulotlari',
      price: 13000,
      brand: 'kefir',
      color: '#059669',
      shape: 'bottle',
      size: { w: 0.24, h: 0.54, d: 0.24 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'dairy_sourcream',
      name: 'Smetana 20% 350g',
      category: 'sut_mahsulotlari',
      price: 14500,
      brand: 'sourcream',
      color: '#0284c7',
      shape: 'cylinder',
      size: { w: 0.26, h: 0.26, d: 0.26 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'dairy_president',
      name: 'Président Sariyog\' 82.5% 200g',
      category: 'sut_mahsulotlari',
      price: 28500,
      brand: 'president',
      color: '#fef08a',
      shape: 'box',
      size: { w: 0.32, h: 0.16, d: 0.2 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'dairy_cheese',
      name: 'Golland Pishlog\'i 300g',
      category: 'sut_mahsulotlari',
      price: 42000,
      brand: 'cheese',
      color: '#eab308',
      shape: 'box',
      size: { w: 0.34, h: 0.18, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    }
  ];

  constructor(scene: THREE.Scene, labelManager: LabelManager) {
    this.scene = scene;
    this.labelManager = labelManager;
    this.buildFourDepartmentAisles();
    this.buildSideAislesAndRefrigerators();
  }

  /**
   * Supermarketning markaziy 2 ta katta gondolasi (Island 1 & Island 2)
   */
  private buildFourDepartmentAisles(): void {
    // 1-Gondola: Z = -3.5 (Oldi = Shirinliklar, Orqasi = Ichimliklar)
    this.createGondolaIsland(
      0,
      -3.5,
      'SHIRINLIKLAR VA PECHYONELAR',
      this.sweetProducts,
      'ICHIMLIKLAR VA SULAR',
      this.drinkProducts
    );

    // 2-Gondola: Z = 3.5 (Oldi = Konservalar, Orqasi = Sut mahsulotlari)
    this.createGondolaIsland(
      0,
      3.5,
      'KONSERVA VA BALIQ MAHSULOTLARI',
      this.cannedProducts,
      'SUT VA SUT MAHSULOTLARI',
      this.dairyProducts
    );
  }

  /**
   * Bo'sh joylarni to'ldirish:
   * - Old tomonga (Z = 10.0) yangi qo'shimcha gondola javon
   * - Orqa devor bo'ylab (Z = -14.5) Korzinka uslubidagi zamonaviy shisha eshikli Katta Muzlatkich / Sovutkichlar
   * - Yon tomonlarga (X = -13 va X = 13) qo'shimcha javonlar
   */
  private buildSideAislesAndRefrigerators(): void {
    // 3-Gondola (Old tomondagi bo'sh joyga): Baqqollik va Choy/Qahva
    this.createGondolaIsland(
      0,
      10.0,
      'BAQCOLLIK VA DON MAHSULOTLARI',
      this.groceryProducts,
      'MAISHIY KIMYO VA GIGIENA',
      this.householdProducts
    );

    // Orqa devor (Z = -15) bo'ylab Katta Shisha Muzlatkichlar (Refrigerators)
    this.createWallRefrigerators(0, -15.5, 18.0);
  }

  // 5. BAQCOLLIK
  private groceryProducts: ProductItem[] = [
    {
      id: 'rice_lazir',
      name: 'Lazer Guruch 1kg',
      category: 'baqqollik',
      price: 24000,
      brand: 'rice',
      color: '#ffffff',
      shape: 'box',
      size: { w: 0.32, h: 0.42, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'makfa_spaghetti',
      name: 'Makfa Spaghetti 500g',
      category: 'baqqollik',
      price: 11000,
      brand: 'makfa',
      color: '#15803d',
      shape: 'box',
      size: { w: 0.22, h: 0.55, d: 0.16 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'oil_oleina',
      name: 'Oleina Kungaboqar Moyi 1L',
      category: 'baqqollik',
      price: 18500,
      brand: 'oil',
      color: '#eab308',
      shape: 'bottle',
      size: { w: 0.22, h: 0.58, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'tea_champion',
      name: 'Champion Choy 250g',
      category: 'baqqollik',
      price: 26000,
      brand: 'tea',
      color: '#dc2626',
      shape: 'box',
      size: { w: 0.3, h: 0.38, d: 0.2 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'nescafe_classic',
      name: 'Nescafé Classic Qahva 190g',
      category: 'baqqollik',
      price: 49000,
      brand: 'nescafe',
      color: '#78350f',
      shape: 'can',
      size: { w: 0.26, h: 0.42, d: 0.26 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'flour_dilyor',
      name: 'Oliy Nav Bug\'doy Uni 2kg',
      category: 'baqqollik',
      price: 16000,
      brand: 'flour',
      color: '#f8fafc',
      shape: 'box',
      size: { w: 0.35, h: 0.48, d: 0.25 },
      korzinkaPlacement: 'ambient_shelf'
    }
  ];

  // 6. MAISHIY KIMYO
  private householdProducts: ProductItem[] = [
    {
      id: 'chem_tide',
      name: 'Tide Kir Yuvish Kukuni 3kg',
      category: 'maishiy_kimyo',
      price: 68000,
      brand: 'tide',
      color: '#ea580c',
      shape: 'box',
      size: { w: 0.38, h: 0.46, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'chem_fairy',
      name: 'Fairy Idish Yuvish Geli 900ml',
      category: 'maishiy_kimyo',
      price: 24000,
      brand: 'fairy',
      color: '#15803d',
      shape: 'bottle',
      size: { w: 0.24, h: 0.54, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'chem_domestos',
      name: 'Domestos Tozalovchi Gel 1L',
      category: 'maishiy_kimyo',
      price: 26000,
      brand: 'domestos',
      color: '#1d4ed8',
      shape: 'bottle',
      size: { w: 0.24, h: 0.56, d: 0.22 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'chem_papia',
      name: 'Papia Sochig\'i 4 dona',
      category: 'maishiy_kimyo',
      price: 28000,
      brand: 'papia',
      color: '#ec4899',
      shape: 'box',
      size: { w: 0.38, h: 0.4, d: 0.26 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'chem_shampoo',
      name: 'Head & Shoulders Shampun 400ml',
      category: 'maishiy_kimyo',
      price: 38000,
      brand: 'domestos',
      color: '#0284c7',
      shape: 'bottle',
      size: { w: 0.22, h: 0.52, d: 0.2 },
      korzinkaPlacement: 'ambient_shelf'
    },
    {
      id: 'chem_soap',
      name: 'Duru Sovun 4x90g',
      category: 'maishiy_kimyo',
      price: 15000,
      brand: 'fairy',
      color: '#10b981',
      shape: 'box',
      size: { w: 0.32, h: 0.25, d: 0.2 },
      korzinkaPlacement: 'ambient_shelf'
    }
  ];

  /**
   * KORZINKA MUZLATKICH VA SOVUTKICHLAR DEVOLI (Orqa tomon devori)
   * Shisha eshikli, neon ko'k chiroqli, tovuq, go'sht, yarim tayyor muzlatilgan mahsulotlar
   */
  private createWallRefrigerators(centerX: number, centerZ: number, totalWidth: number): void {
    const fridgeGroup = new THREE.Group();
    fridgeGroup.position.set(centerX, 0, centerZ);

    const fridgeHeight = 2.7;
    const fridgeDepth = 1.2;

    const fridgeBodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.3,
    });

    const fridgeInnerMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.2,
    });

    const glassDoorMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
    });

    const neonGlowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // Asosiy korpus
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(totalWidth, fridgeHeight, fridgeDepth),
      fridgeBodyMat
    );
    body.position.set(0, fridgeHeight / 2, 0);
    fridgeGroup.add(body);

    // Ichki o'yilgan qism (yengil bo'shliq foni)
    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(totalWidth - 0.4, fridgeHeight - 0.5, 0.1),
      fridgeInnerMat
    );
    inner.position.set(0, fridgeHeight / 2 - 0.05, -0.4);
    fridgeGroup.add(inner);

    // Tepadagi tablichka: "MUZLATILGAN MAHSULOTLAR VA GO'SHT BO'LIMI"
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1024;
    signCanvas.height = 128;
    const sCtx = signCanvas.getContext('2d')!;
    sCtx.fillStyle = '#0284c7';
    sCtx.fillRect(0, 0, 1024, 128);
    sCtx.strokeStyle = '#ffffff';
    sCtx.lineWidth = 4;
    sCtx.strokeRect(8, 8, 1008, 112);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = '900 42px "Arial Black", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('❄️   MUZLATILGAN MAHSULOTLAR VA GO\'SHT   ❄️', 512, 64);

    const signBoard = new THREE.Mesh(
      new THREE.PlaneGeometry(totalWidth * 0.7, 0.45),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) })
    );
    signBoard.position.set(0, fridgeHeight + 0.25, fridgeDepth / 2 + 0.02);
    fridgeGroup.add(signBoard);

    // Shisha eshiklar (har 2 metrda bitta shisha ramka va neon)
    const doorCount = Math.floor(totalWidth / 2.2);
    const doorStep = totalWidth / doorCount;

    for (let i = 0; i < doorCount; i++) {
      const doorX = -totalWidth / 2 + (i + 0.5) * doorStep;

      // Shisha eshik
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(doorStep - 0.1, fridgeHeight - 0.6, 0.04),
        glassDoorMat
      );
      door.position.set(doorX, fridgeHeight / 2 - 0.05, fridgeDepth / 2);
      fridgeGroup.add(door);

      // Eshik tutqichi
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
      );
      handle.position.set(doorX + (doorStep / 2) - 0.2, fridgeHeight / 2 - 0.05, fridgeDepth / 2 + 0.04);
      fridgeGroup.add(handle);

      // Neon LED ichki chiroq
      const neonStrip = new THREE.Mesh(
        new THREE.BoxGeometry(doorStep - 0.2, 0.03, 0.03),
        neonGlowMat
      );
      neonStrip.position.set(doorX, fridgeHeight - 0.38, fridgeDepth / 2 - 0.05);
      fridgeGroup.add(neonStrip);
    }

    // Muzlatkich javonlaridagi mahsulotlar (Tovuq, Go'sht, Chuchvara, Muzlatilgan Sabzavot)
    const frozenTiers = [0.4, 0.9, 1.4, 1.9];
    const frozenItems: ProductItem[] = [
      {
        id: 'frz_chicken',
        name: 'Halol Tovuq Go\'shti 1kg',
        category: 'muzlatilgan',
        price: 36000,
        brand: 'frozen_chicken',
        color: '#0284c7',
        shape: 'box',
        size: { w: 0.4, h: 0.3, d: 0.28 },
        korzinkaPlacement: 'refrigerator'
      },
      {
        id: 'frz_beef',
        name: 'Saralangan Mol Go\'shti 1kg',
        category: 'muzlatilgan',
        price: 95000,
        brand: 'frozen_beef',
        color: '#991b1b',
        shape: 'box',
        size: { w: 0.4, h: 0.28, d: 0.28 },
        korzinkaPlacement: 'refrigerator'
      },
      {
        id: 'frz_dumplings',
        name: 'Mazzali Chuchvara 800g',
        category: 'muzlatilgan',
        price: 28000,
        brand: 'frozen_dumplings',
        color: '#2563eb',
        shape: 'box',
        size: { w: 0.38, h: 0.3, d: 0.26 },
        korzinkaPlacement: 'refrigerator'
      },
      {
        id: 'frz_veg',
        name: 'Muzlatilgan Sabzavotlar Mix 400g',
        category: 'muzlatilgan',
        price: 19000,
        brand: 'frozen_veg',
        color: '#16a34a',
        shape: 'box',
        size: { w: 0.36, h: 0.28, d: 0.22 },
        korzinkaPlacement: 'refrigerator'
      }
    ];

    frozenTiers.forEach((tierY, idx) => {
      const prod = frozenItems[idx % frozenItems.length];
      const itemCount = 14;
      const colStep = (totalWidth - 1.5) / itemCount;

      for (let c = 0; c < itemCount; c++) {
        const pX = - (totalWidth - 1.5) / 2 + c * colStep + colStep / 2;
        const pZ = centerZ + fridgeDepth / 2 - 0.25;

        const prodModel = ProductModelFactory.createProductModel(prod);
        prodModel.position.set(centerX + pX, tierY, pZ);
        prodModel.userData = { productId: prod.id, product: prod };

        prodModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.userData = { productId: prod.id, product: prod, parentGroup: prodModel };
            this.clickableMeshes.push(child);
          }
        });

        this.scene.add(prodModel);

        if (c % 3 === 0) {
          this.labelManager.attachLabel(prodModel, prod);
        }

        this.productMeshes.push({
          group: prodModel,
          product: prod,
          originalY: tierY,
        });
      }
    });

    this.scene.add(fridgeGroup);

    // Muzlatkich to'qnashuv chegarasi (devor qilib to'sish)
    const collider = new THREE.Box3();
    collider.setFromCenterAndSize(
      new THREE.Vector3(centerX, fridgeHeight / 2, centerZ),
      new THREE.Vector3(totalWidth + 0.4, fridgeHeight, fridgeDepth + 0.4)
    );
    this.shelfColliders.push(collider);
  }

  /**
   * 2 tomonlama to'liq Gondola oroli (Old va Orqa tomonida alohida mahsulotlar va alohida tablichkalar)
   */
  private createGondolaIsland(
    centerX: number,
    centerZ: number,
    frontTitle: string,
    frontProducts: ProductItem[],
    backTitle: string,
    backProducts: ProductItem[]
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

    // 1. Orqa ajratuvchi panel
    const backPanel = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.04),
      shelfWhiteMat
    );
    backPanel.position.set(0, shelfHeight / 2, 0);
    backPanel.castShadow = true;
    rowGroup.add(backPanel);

    // 2. Qizil stoykalar
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

      // Xrom simlar
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

    // 5. TEPADAGI TABLICHKALAR: Oldiga bitta, Orqasiga bitta alohida yozuv!
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth * 0.74, 0.44, 0.06),
      shelfRedMat
    );
    signBoard.position.set(0, shelfHeight + 0.22, 0);
    rowGroup.add(signBoard);

    // Old tomon tablichkasi
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 1024;
    frontCanvas.height = 128;
    const fCtx = frontCanvas.getContext('2d')!;
    fCtx.fillStyle = '#991b1b';
    fCtx.fillRect(0, 0, 1024, 128);
    fCtx.strokeStyle = '#ffffff';
    fCtx.lineWidth = 4;
    fCtx.strokeRect(10, 10, 1004, 108);
    fCtx.fillStyle = '#ffffff';
    fCtx.font = '900 44px "Arial Black", sans-serif';
    fCtx.textAlign = 'center';
    fCtx.textBaseline = 'middle';
    fCtx.fillText(`🛒   ${frontTitle}   🛒`, 512, 64);

    const frontSignPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.72, 0.4),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(frontCanvas) })
    );
    frontSignPlate.position.set(0, shelfHeight + 0.22, 0.04);
    rowGroup.add(frontSignPlate);

    // Orqa tomon tablichkasi
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 1024;
    backCanvas.height = 128;
    const bCtx = backCanvas.getContext('2d')!;
    bCtx.fillStyle = '#991b1b';
    bCtx.fillRect(0, 0, 1024, 128);
    bCtx.strokeStyle = '#ffffff';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(10, 10, 1004, 108);
    bCtx.fillStyle = '#ffffff';
    bCtx.font = '900 44px "Arial Black", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText(`🛒   ${backTitle}   🛒`, 512, 64);

    const backSignPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(shelfWidth * 0.72, 0.4),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(backCanvas) })
    );
    backSignPlate.position.set(0, shelfHeight + 0.22, -0.04);
    backSignPlate.rotation.y = Math.PI;
    rowGroup.add(backSignPlate);

    this.scene.add(rowGroup);

    // To'qnashuv
    const collider = new THREE.Box3();
    collider.setFromCenterAndSize(
      new THREE.Vector3(centerX, shelfHeight / 2, centerZ),
      new THREE.Vector3(shelfWidth + 0.4, shelfHeight, shelfDepth + 0.4)
    );
    this.shelfColliders.push(collider);

    // 6. OLD TOMONGA FRONT PRODUCTS TERISH (+Z)
    this.populateSingleSide(centerX, centerZ, tierHeights, shelfWidth, frontProducts, 0.28, false);

    // 7. ORQA TOMONGA BACK PRODUCTS TERISH (-Z)
    this.populateSingleSide(centerX, centerZ, tierHeights, shelfWidth, backProducts, -0.28, true);
  }

  private populateSingleSide(
    centerX: number,
    centerZ: number,
    tierHeights: number[],
    shelfWidth: number,
    productList: ProductItem[],
    sideZ: number,
    isFlipped: boolean
  ): void {
    const columnsCount = 18;
    const colStep = (shelfWidth - 0.8) / columnsCount;

    tierHeights.forEach((tierY, tierIdx) => {
      const currentProduct = productList[tierIdx];

      for (let col = 0; col < columnsCount; col++) {
        const posX = centerX - (shelfWidth - 0.8) / 2 + col * colStep + colStep / 2;
        const posZ = centerZ + sideZ;
        const spawnY = tierY + 0.02;

        const prodModel = ProductModelFactory.createProductModel(currentProduct);
        prodModel.position.set(posX, spawnY, posZ);

        if (isFlipped) {
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

        if (col % 3 === 0) {
          this.labelManager.attachLabel(prodModel, currentProduct);
        }

        this.productMeshes.push({
          group: prodModel,
          product: currentProduct,
          originalY: spawnY,
        });

        // Chuqurlik bo'yicha zaxira nusxasi (orqa qatori)
        const depthOffset = isFlipped ? 0.14 : -0.14;
        const backCopy = ProductModelFactory.createProductModel(currentProduct);
        backCopy.position.set(posX, spawnY, posZ + depthOffset);
        if (isFlipped) backCopy.rotation.y = Math.PI;
        this.scene.add(backCopy);
      }
    });
  }

  public getClickableObjects(): THREE.Object3D[] {
    return this.clickableMeshes;
  }
}
