import * as THREE from 'three';
import { ProductItem } from '../types';
import { ProductTextureGenerator } from './productTextureGenerator';

/**
 * Supermarketdagi har bir mahsulotni 3D model sifatida yasovchi klass.
 * Shirinliklar, shishalar, bankalar va qutilarning o'ziga xos geometriyasi.
 */
export class ProductModelFactory {
  public static createProductModel(product: ProductItem): THREE.Group {
    const group = new THREE.Group();

    switch (product.shape) {
      case 'bottle':
        this.buildBottle(group, product);
        break;
      case 'can':
        this.buildNutellaJar(group, product);
        break;
      case 'box':
      default:
        this.buildSweetBox(group, product);
        break;
    }

    return group;
  }

  /**
   * 1. SHIRINLIK QUTILARI VA BATONCHIKLARI (Twix, Choco-Pie, Oreo, Milka, Snickers)
   */
  private static buildSweetBox(group: THREE.Group, product: ProductItem): void {
    const { w, h, d } = product.size;
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    const sideMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(product.color),
      roughness: 0.25,
      metalness: 0.1,
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.2,
      metalness: 0.05,
    });

    const materials = [
      sideMat, sideMat, sideMat, sideMat,
      frontMat, // Old
      frontMat, // Orqa
    ];

    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materials);
    box.position.y = h / 2;
    box.castShadow = true;
    box.receiveShadow = true;
    group.add(box);
  }

  /**
   * 2. NUTELLA BANKASI (Rasmdagi oq qopqoqli va shisha tanali banka)
   */
  private static buildNutellaJar(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;

    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    // Shisha banka tanasi
    const bodyMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.2,
    });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h * 0.8, 32), bodyMat);
    body.position.y = (h * 0.8) / 2;
    body.castShadow = true;
    group.add(body);

    // Oq qopqoq (krishka)
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.95, r * 0.95, h * 0.2, 28), capMat);
    cap.position.y = h * 0.8 + (h * 0.2) / 2;
    cap.castShadow = true;
    group.add(cap);
  }

  /**
   * 3. ICHIMLIK SHISHALARI (Nestle, Montella, Sprite, Fanta, Cola, Pepsi)
   */
  private static buildBottle(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;

    let liquidColor = 0x140602;
    let liquidOpacity = 0.98;
    let plasticColor = 0xffffff;
    let plasticOpacity = 0.35;
    let capColor = 0x005cb9;

    if (product.brand === 'nestle') {
      liquidColor = 0xe0f2fe;
      liquidOpacity = 0.45;
      plasticColor = 0xbae6fd;
      plasticOpacity = 0.55;
      capColor = 0x0284c7;
    } else if (product.brand === 'montella') {
      liquidColor = 0xf0f9ff;
      liquidOpacity = 0.4;
      plasticColor = 0xe0f2fe;
      plasticOpacity = 0.5;
      capColor = 0x38bdf8;
    } else if (product.brand === 'sprite') {
      liquidColor = 0x15803d;
      liquidOpacity = 0.75;
      plasticColor = 0x22c55e;
      plasticOpacity = 0.65;
      capColor = 0x16a34a;
    } else if (product.brand === 'fanta') {
      liquidColor = 0xea580c;
      liquidOpacity = 0.9;
      plasticColor = 0xfb923c;
      plasticOpacity = 0.4;
      capColor = 0x0284c7;
    } else if (product.brand === 'cola') {
      liquidColor = 0x140602;
      liquidOpacity = 0.98;
      capColor = 0xdc2626;
    } else if (product.brand === 'pepsi') {
      liquidColor = 0x140602;
      liquidOpacity = 0.98;
      capColor = 0x005cb9;
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

    // Pastki bel
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(r * 0.94, 0.02));
    points.push(new THREE.Vector2(r, 0.08));
    points.push(new THREE.Vector2(r * 0.9, 0.16));
    points.push(new THREE.Vector2(r, 0.24));

    const lowerBody = new THREE.Mesh(new THREE.LatheGeometry(points, 32), liquidMat);
    lowerBody.castShadow = true;
    group.add(lowerBody);

    // Etiketka
    const labelHeight = 0.18;
    const labelY = 0.24 + labelHeight / 2;
    const labelMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 1.01, r * 1.01, labelHeight, 36),
      labelMat
    );
    labelMesh.position.y = labelY;
    labelMesh.castShadow = true;
    group.add(labelMesh);

    const coreLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.99, r * 0.99, labelHeight, 28),
      liquidMat
    );
    coreLiquid.position.y = labelY;
    group.add(coreLiquid);

    // Yelka
    const shoulderBaseY = 0.24 + labelHeight;
    const liquidTopHeight = 0.06;
    const shoulderLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.8, r, liquidTopHeight, 32),
      liquidMat
    );
    shoulderLiquid.position.y = shoulderBaseY + liquidTopHeight / 2;
    group.add(shoulderLiquid);

    const airHeight = 0.08;
    const airMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.42, r * 0.8, airHeight, 32),
      clearPetMat
    );
    airMesh.position.y = shoulderBaseY + liquidTopHeight + airHeight / 2;
    group.add(airMesh);

    // Bo'yin va qopqoq
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
  }
}
