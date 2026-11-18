import * as THREE from 'three';
import { ProductItem } from '../types';
import { ProductTextureGenerator } from './productTextureGenerator';

/**
 * Supermarketdagi ichimlik shishalarini rasmga 100% o'xshash qilib yasovchi klass:
 * - Shaffof suvlar (Montella, Nestle) shaffof ko'k/oq PET plastik va shaffof suv suyuqligiga ega.
 * - Sprite: yashil shaffof shisha.
 * - Fanta: apelsin suyuqlik.
 * - Cola & Pepsi: to'q qora-jigarrang gazlangan kola suyuqligi.
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
      case 'box':
      default:
        this.buildBox(group, product);
        break;
    }

    return group;
  }

  /**
   * 🎯 100% RASMDAGI BIR XIL SHISHA MODELLARI:
   * Suyuqlik va shisha ranglari:
   * - nestle: shaffof oq/och havorang suv, ko'k qopqoq
   * - montella: shaffof toza suv, och ko'k qopqoq
   * - sprite: yashil shaffof shisha, yashil qopqoq
   * - fanta: yorqin apelsin rangli suyuqlik, to'q sariq/ko'k qopqoq
   * - cola: to'q qora kola suyuqligi, qizil qopqoq
   * - pepsi: to'q qora kola suyuqligi, ko'k qopqoq
   */
  private static buildBottle(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;

    // Suyuqlik rangi va shaffoflik sozlamalari
    let liquidColor = 0x160a04; // Kola qora
    let liquidOpacity = 0.98;
    let plasticColor = 0xffffff;
    let plasticOpacity = 0.35;
    let capColor = 0x005cb9;

    if (product.brand === 'nestle') {
      liquidColor = 0xe0f2fe; // Shaffof toza suv
      liquidOpacity = 0.45;
      plasticColor = 0xbae6fd;
      plasticOpacity = 0.55;
      capColor = 0x0284c7; // Nestlé ko'k qopqog'i
    } else if (product.brand === 'montella') {
      liquidColor = 0xf0f9ff; // Oq toza suv
      liquidOpacity = 0.4;
      plasticColor = 0xe0f2fe;
      plasticOpacity = 0.5;
      capColor = 0x38bdf8; // Montella havorang qopqog'i
    } else if (product.brand === 'sprite') {
      liquidColor = 0x15803d; // Zangori-yashil
      liquidOpacity = 0.75;
      plasticColor = 0x22c55e;
      plasticOpacity = 0.65;
      capColor = 0x16a34a; // Sprite yashil qopqoq
    } else if (product.brand === 'fanta') {
      liquidColor = 0xea580c; // Apelsin to'q sariq
      liquidOpacity = 0.9;
      plasticColor = 0xfb923c;
      plasticOpacity = 0.4;
      capColor = 0x0284c7; // Fanta ko'k qopqoq
    } else if (product.brand === 'cola') {
      liquidColor = 0x140602; // Coca-Cola qora
      liquidOpacity = 0.98;
      capColor = 0xdc2626; // Qizil qopqoq
    } else if (product.brand === 'pepsi') {
      liquidColor = 0x140602; // Pepsi qora
      liquidOpacity = 0.98;
      capColor = 0x005cb9; // Pepsi ko'k qopqoq
    }

    const liquidMat = new THREE.MeshStandardMaterial({
      color: liquidColor,
      roughness: 0.15,
      metalness: 0.1,
      transparent: liquidOpacity < 0.95,
      opacity: liquidOpacity,
    });

    const clearPetMat = new THREE.MeshStandardMaterial({
      color: plasticColor,
      roughness: 0.1,
      metalness: 0.15,
      transparent: true,
      opacity: plasticOpacity,
    });

    const labelTex = ProductTextureGenerator.getTexture(product, 1024, 512);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      roughness: 0.25,
      metalness: 0.1,
    });

    // 1. Pastki qism va to'lqinli bel (Waist)
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(r * 0.94, 0.02));
    points.push(new THREE.Vector2(r, 0.08));
    points.push(new THREE.Vector2(r * 0.9, 0.16));
    points.push(new THREE.Vector2(r, 0.24));

    const lowerBody = new THREE.Mesh(new THREE.LatheGeometry(points, 32), liquidMat);
    lowerBody.castShadow = true;
    group.add(lowerBody);

    // 2. Etiketka
    const labelHeight = 0.18;
    const labelY = 0.24 + labelHeight / 2;
    const labelMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 1.01, r * 1.01, labelHeight, 36),
      labelMat
    );
    labelMesh.position.y = labelY;
    labelMesh.castShadow = true;
    group.add(labelMesh);

    // Etiketka ichidagi suyuqlik yadrosi
    const coreLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.99, r * 0.99, labelHeight, 28),
      liquidMat
    );
    coreLiquid.position.y = labelY;
    group.add(coreLiquid);

    // 3. Yuqori yelka (suyuqlik va havo sathi)
    const shoulderBaseY = 0.24 + labelHeight;
    const liquidTopHeight = 0.06;

    const shoulderLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.8, r, liquidTopHeight, 32),
      liquidMat
    );
    shoulderLiquid.position.y = shoulderBaseY + liquidTopHeight / 2;
    group.add(shoulderLiquid);

    // Tepasidagi havo bo'shlig'i (PET plastik)
    const airHeight = 0.08;
    const airMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.42, r * 0.8, airHeight, 32),
      clearPetMat
    );
    airMesh.position.y = shoulderBaseY + liquidTopHeight + airHeight / 2;
    group.add(airMesh);

    // 4. Bo'yin va Krishka (Qopqoq)
    const neckBaseY = shoulderBaseY + liquidTopHeight + airHeight;
    const neckHeight = 0.04;
    const neckMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.38, r * 0.42, neckHeight, 24),
      clearPetMat
    );
    neckMesh.position.y = neckBaseY + neckHeight / 2;
    group.add(neckMesh);

    const capHeight = 0.035;
    const capMat = new THREE.MeshStandardMaterial({ color: capColor, roughness: 0.35 });
    const capMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.44, r * 0.44, capHeight, 28),
      capMat
    );
    capMesh.position.y = neckBaseY + neckHeight + capHeight / 2;
    capMesh.castShadow = true;
    group.add(capMesh);

    const ringMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.42, r * 0.42, 0.01, 24),
      capMat
    );
    ringMesh.position.y = neckBaseY + neckHeight - 0.006;
    group.add(ringMesh);
  }

  private static buildCan(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, h * 0.88, 32),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.25 })
    );
    body.position.y = h / 2;
    body.castShadow = true;
    group.add(body);
  }

  private static buildBox(group: THREE.Group, product: ProductItem): void {
    const { w, h, d } = product.size;
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);
    const sideMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(product.color) });
    const frontMat = new THREE.MeshStandardMaterial({ map: texture });

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      [sideMat, sideMat, sideMat, sideMat, frontMat, frontMat]
    );
    box.position.y = h / 2;
    box.castShadow = true;
    group.add(box);
  }
}
