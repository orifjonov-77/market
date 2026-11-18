import * as THREE from 'three';
import { ProductItem } from '../types';
import { ProductTextureGenerator } from './productTextureGenerator';

/**
 * Supermarketdagi har bir mahsulotni haqiqiy qadoq va shaklda yasovchi factory:
 * - Shishalar (Kola, suvlar, yog', kefir, fairy, domestos)
 * - TetraPak va sut qutilari (Kamilka, Musaffo)
 * - Konserva metall bankalari (Tunes, Sardina, Bonduelle, Nutella)
 * - Qutilar va batonchiklar (Snickers, Twix, Milka, ChocoPie, Makfa, Tess, Guruch, Tide, Papia)
 * - Yumaloq nonlar (Samarqand non, Patir)
 * - Meva va sabzavotlar (Olma, banan, apelsin, kartoshka, pomidor, bodring)
 * - Muzlatilgan mahsulotlar (Tovuq, mol go'shti, chuchvara, sabzavotlar)
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
      case 'fruit':
        this.buildFruit(group, product);
        break;
      case 'frozen_pack':
        this.buildFrozenPack(group, product);
        break;
      case 'cylinder':
        this.buildCylinder(group, product);
        break;
      case 'box':
      default:
        this.buildBox(group, product);
        break;
    }

    return group;
  }

  // 1. QUTILAR VA BATONCHIKLAR
  private static buildBox(group: THREE.Group, product: ProductItem): void {
    const { w, h, d } = product.size;
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    const sideMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(product.color),
      roughness: 0.25,
      metalness: 0.08,
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

    if (product.brand === 'milk_kamilka' || product.brand === 'milk_musaffo') {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
      );
      cap.position.set(w * 0.22, h + 0.015, 0);
      group.add(cap);
    }
  }

  // 2. KONSERVA VA BANKALAR
  private static buildCan(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    const isNutella = product.brand === 'nutella';
    const bodyGeo = new THREE.CylinderGeometry(r, r, h * 0.85, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.2,
      metalness: isNutella ? 0.05 : 0.4,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = (h * 0.85) / 2;
    body.castShadow = true;
    group.add(body);

    const capColor = isNutella ? 0xffffff : 0xd1d5db;
    const capMat = new THREE.MeshStandardMaterial({
      color: capColor,
      roughness: isNutella ? 0.3 : 0.2,
      metalness: isNutella ? 0.05 : 0.85,
    });

    const topRim = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 1.02, r, h * 0.1, 32),
      capMat
    );
    topRim.position.y = h - (h * 0.1) / 2;
    group.add(topRim);
  }

  // 3. SHISHALAR
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
    } else if (product.brand === 'oil') {
      liquidColor = 0xfacc15;
      liquidOpacity = 0.75;
      plasticColor = 0xfef08a;
      plasticOpacity = 0.5;
      capColor = 0xeab308;
    } else if (product.brand === 'fairy') {
      liquidColor = 0x16a34a;
      liquidOpacity = 0.85;
      capColor = 0xdc2626;
    } else if (product.brand === 'domestos') {
      liquidColor = 0x1e3a8a;
      liquidOpacity = 0.98;
      capColor = 0xdc2626;
    } else if (product.brand === 'kefir') {
      liquidColor = 0xffffff;
      liquidOpacity = 0.98;
      capColor = 0x059669;
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

  // 4. MEVA VA SABZAVOTLAR
  private static buildFruit(group: THREE.Group, product: ProductItem): void {
    const { w } = product.size;
    const r = w / 2;

    const fruitMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(product.color),
      roughness: 0.35,
      metalness: 0.05,
    });

    let geo: THREE.BufferGeometry;
    if (product.brand === 'produce_banana') {
      geo = new THREE.CylinderGeometry(r * 0.5, r * 0.4, w * 1.2, 16);
    } else if (product.brand === 'produce_cucumber') {
      geo = new THREE.CylinderGeometry(r * 0.45, r * 0.4, w * 1.3, 16);
    } else {
      geo = new THREE.SphereGeometry(r, 24, 24);
    }

    const mesh = new THREE.Mesh(geo, fruitMat);
    mesh.position.y = r;
    mesh.castShadow = true;
    group.add(mesh);
  }

  // 5. MUZLATILGAN PAKETLAR
  private static buildFrozenPack(group: THREE.Group, product: ProductItem): void {
    const { w, h, d } = product.size;
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    const packGeo = new THREE.BoxGeometry(w, h, d);
    const packMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.3,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(packGeo, packMat);
    mesh.position.y = h / 2;
    mesh.castShadow = true;
    group.add(mesh);
  }

  // 6. NON
  private static buildBread(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;
    const texture = ProductTextureGenerator.getTexture(product, 512, 512);

    const breadGeo = new THREE.CylinderGeometry(r, r * 0.9, h, 32);
    const breadMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.85,
    });
    const bread = new THREE.Mesh(breadGeo, breadMat);
    bread.position.y = h / 2;
    bread.castShadow = true;
    group.add(bread);
  }

  // 7. SILINDR
  private static buildCylinder(group: THREE.Group, product: ProductItem): void {
    const { w, h } = product.size;
    const r = w / 2;
    const texture = ProductTextureGenerator.getTexture(product, 1024, 512);

    const geo = new THREE.CylinderGeometry(r, r * 0.88, h, 32);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.25,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = h / 2;
    mesh.castShadow = true;
    group.add(mesh);
  }
}
