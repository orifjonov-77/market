import * as THREE from 'three';
import { ProductItem } from '../types';
import { ProductTextureGenerator } from './productTextureGenerator';

/**
 * Supermarketdagi har bir mahsulotni haqiqiy qadoq va shaklda yasovchi klass.
 * Pepsi uchun: yuborilgan rasmga 100% mos to'lqinsimon konturli shisha va to'q jigarrang kola suyuqligi!
 */
export class ProductModelFactory {
  public static createProductModel(product: ProductItem): THREE.Group {
    const group = new THREE.Group();

    switch (product.shape) {
      case 'bottle':
        this.buildBottle(group, product);
        break;
      case 'can':
        this.buildCan(group, product);
        break;
      case 'bread_round':
        this.buildBread(group, product);
        break;
      case 'box':
        this.buildBox(group, product);
        break;
      case 'cylinder':
      default:
        this.buildCylinder(group, product);
        break;
    }

    return group;
  }

  /**
   * 🎯 1. ICHIMLIK SHISHALARI (Ayniqsa rasmdagi Pepsi 1.5L):
   * Rasmda ko'ringanidek:
   * 1. Yuqorida havo bo'shlig'i (shaffof konus)
   * 2. Qora/to'q jigarrang gazli kola suyuqligi (liquid inside)
   * 3. O'rtadagi to'g'ri to'rtburchak moviy etiketka (pepsi globusi bilan)
   * 4. Pastki to'lqinsimon "bel" qismi (botiqlik) va pastki oyoqchalari (petals)
   * 5. Moviy qopqoq (krishka)
   */
  private static buildBottle(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2; // 0.11

    // Shisha ichidagi suyuqlik materiali (Pepsi va Cola uchun to'q qora-qizil gazlangan kola)
    const colaLiquidMat = new THREE.MeshStandardMaterial({
      color: 0x160a04, // To'q jigarrang/qora kola suyuqligi
      roughness: 0.12,
      metalness: 0.15,
    });

    // Shaffof PET plastik materiali (shisha shaffofligi va yaltirashi)
    const clearPetMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.35,
    });

    // Etiketka materiali (Rasm bilan 100% bir xil)
    const labelTex = ProductTextureGenerator.getTexture(product, 1024, 512);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      roughness: 0.25,
      metalness: 0.1,
    });

    // --- A. PASTKI ASOS VA BEL QISMI (Oyoqchalari va botiq beli) ---
    // Pastki shisha qismi: rasmda pastki qismida to'lqinsimon qavariqlik va toraygan bel bor
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0)); // markaz tagi
    points.push(new THREE.Vector2(r * 0.95, 0.02)); // pastki oyoq
    points.push(new THREE.Vector2(r, 0.08)); // pastki kengayish
    points.push(new THREE.Vector2(r * 0.9, 0.16)); // rasmdagi o'rta bel botiqligi (waist)
    points.push(new THREE.Vector2(r, 0.24)); // etiketka osti kengayishi

    const lowerBodyGeo = new THREE.LatheGeometry(points, 32);
    const lowerBodyMesh = new THREE.Mesh(lowerBodyGeo, colaLiquidMat);
    lowerBodyMesh.castShadow = true;
    group.add(lowerBodyMesh);

    // --- B. O'RTADAGI ETİKETKA TANASI ---
    const labelHeight = 0.18;
    const labelY = 0.24 + labelHeight / 2;
    const labelGeo = new THREE.CylinderGeometry(r * 1.01, r * 1.01, labelHeight, 36);
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = labelY;
    labelMesh.castShadow = true;
    group.add(labelMesh);

    // Etiketka ichidagi suyuqlik o'zagi
    const liquidCore = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.99, r * 0.99, labelHeight, 28), colaLiquidMat);
    liquidCore.position.y = labelY;
    group.add(liquidCore);

    // --- C. YUQORI YELKA VA HAVO BO'SHLIG'I (Rasmda suyuqlik sathidan yuqori shaffof) ---
    const shoulderBaseY = 0.24 + labelHeight;
    const liquidTopHeight = 0.06;

    // Suyuqlik sathi (yelkaning pastki to'lgan qismi)
    const shoulderLiquidGeo = new THREE.CylinderGeometry(r * 0.8, r, liquidTopHeight, 32);
    const shoulderLiquid = new THREE.Mesh(shoulderLiquidGeo, colaLiquidMat);
    shoulderLiquid.position.y = shoulderBaseY + liquidTopHeight / 2;
    group.add(shoulderLiquid);

    // Havo bo'shlig'i (rasmda ko'ringan yelkadagi shaffof qism)
    const airHeight = 0.08;
    const airGeo = new THREE.CylinderGeometry(r * 0.42, r * 0.8, airHeight, 32);
    const airMesh = new THREE.Mesh(airGeo, clearPetMat);
    airMesh.position.y = shoulderBaseY + liquidTopHeight + airHeight / 2;
    group.add(airMesh);

    // --- D. BO'YIN VA KRISHKA ---
    const neckBaseY = shoulderBaseY + liquidTopHeight + airHeight;
    const neckHeight = 0.04;
    const neckGeo = new THREE.CylinderGeometry(r * 0.38, r * 0.42, neckHeight, 24);
    const neckMesh = new THREE.Mesh(neckGeo, clearPetMat);
    neckMesh.position.y = neckBaseY + neckHeight / 2;
    group.add(neckMesh);

    // Moviy rasmdagi Pepsi qopqog'i (krishka)
    let capColor = 0x005cb9; // Pepsi och ko'k qopqog'i
    if (product.brand === 'cola') capColor = 0xdc2626;
    if (product.brand === 'fanta') capColor = 0xea580c;
    if (product.brand === 'sprite') capColor = 0x16a34a;
    if (product.brand === 'water') capColor = 0x38bdf8;
    if (product.brand === 'oil') capColor = 0xfacc15;

    const capHeight = 0.035;
    const capGeo = new THREE.CylinderGeometry(r * 0.44, r * 0.44, capHeight, 28);
    const capMat = new THREE.MeshStandardMaterial({
      color: capColor,
      roughness: 0.35,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = neckBaseY + neckHeight + capHeight / 2;
    capMesh.castShadow = true;
    group.add(capMesh);

    // Krishka ostidagi himoya uzugi (ring)
    const ringGeo = new THREE.CylinderGeometry(r * 0.42, r * 0.42, 0.01, 24);
    const ringMesh = new THREE.Mesh(ringGeo, capMat);
    ringMesh.position.y = neckBaseY + neckHeight - 0.006;
    group.add(ringMesh);
  }

  /**
   * 2. QUTI SHAKLIDAGI MAHSULOTLAR (Snickers, Milka, Kamilka Sut, Dena, Makfa, Tess, ChocoPie)
   */
  private static buildBox(group: THREE.Group, product: ProductItem): void {
    const { w, h, d } = product.size;
    const boxGeo = new THREE.BoxGeometry(w, h, d);
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    const sideMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(product.color),
      roughness: 0.25,
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.2,
    });

    const materials = [
      sideMat, sideMat, sideMat, sideMat,
      frontMat, // Old
      frontMat, // Orqa
    ];

    const box = new THREE.Mesh(boxGeo, materials);
    box.position.y = h / 2;
    box.castShadow = true;
    box.receiveShadow = true;
    group.add(box);

    if (product.brand === 'milk' || product.brand === 'musaffo' || product.brand === 'dena') {
      const capGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(w * 0.22, h + 0.015, 0);
      group.add(cap);
    }
  }

  /**
   * 3. KONSERVA VA BANKALAR (Bonduelle, Tunes, Nutella, Nescafe)
   */
  private static buildCan(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    const bodyGeo = new THREE.CylinderGeometry(r, r, h * 0.88, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.25,
      metalness: 0.15,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = h / 2;
    body.castShadow = true;
    group.add(body);

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.2,
    });

    const rimGeo = new THREE.CylinderGeometry(r * 1.02, r, h * 0.06, 32);
    const topRim = new THREE.Mesh(rimGeo, rimMat);
    topRim.position.y = h - (h * 0.06) / 2;
    group.add(topRim);

    const botRim = new THREE.Mesh(rimGeo, rimMat);
    botRim.position.y = (h * 0.06) / 2;
    group.add(botRim);
  }

  /**
   * 4. NON MAHSULOTLARI (Samarqand non, Patir)
   */
  private static buildBread(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;
    const texture = ProductTextureGenerator.getTexture(product, 512, 512);

    const breadGeo = new THREE.CylinderGeometry(r, r * 0.9, h, 32);
    const breadMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
    });
    const bread = new THREE.Mesh(breadGeo, breadMat);
    bread.position.y = h / 2;
    bread.castShadow = true;
    group.add(bread);
  }

  /**
   * 5. SILINDRSIMON BOSHQALAR (Oreo, Baget, Smetana)
   */
  private static buildCylinder(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    const geo = new THREE.CylinderGeometry(r, r, h, 28);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.3,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = h / 2;
    mesh.castShadow = true;
    group.add(mesh);
  }
}
