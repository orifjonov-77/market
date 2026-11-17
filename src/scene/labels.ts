import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import * as THREE from 'three';
import { ProductItem } from '../types';

/**
 * Mahsulot oldiga borganda ko'rinuvchi nom va narx ko'rsatkichlari.
 * Faqat foydalanuvchi yaqinlashganda (masofaga qarab) yorliqlar paydo bo'ladi.
 */
export class LabelManager {
  private labelRenderer: CSS2DRenderer;
  private labelsList: Array<{
    id: string;
    object: CSS2DObject;
    element: HTMLElement;
    worldPos: THREE.Vector3;
    parentMesh: THREE.Object3D;
  }> = [];

  // Ko'rinish masofasi: mahsulot oldiga borgandagina (3.8 metr ichida) chiqadi!
  private visibilityThreshold = 3.8;

  constructor(container: HTMLElement) {
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.left = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.labelRenderer.domElement.style.zIndex = '5';
    container.appendChild(this.labelRenderer.domElement);
  }

  /**
   * Mahsulotga CSS2D yorlig'ini bog'lash
   */
  public attachLabel(mesh: THREE.Object3D, product: ProductItem): void {
    const div = document.createElement('div');
    div.className = 'product-tag hidden-by-distance';
    div.innerHTML = `
      <div class="product-tag-name">${product.name}</div>
      <div class="product-tag-price">${product.price.toLocaleString('uz-UZ')} so'm</div>
    `;

    const label = new CSS2DObject(div);
    // Mahsulot ustida chiroyli markazlash
    label.position.set(0, product.size.h * 0.7 + 0.12, 0);
    mesh.add(label);

    this.labelsList.push({
      id: product.id,
      object: label,
      element: div,
      worldPos: new THREE.Vector3(),
      parentMesh: mesh,
    });
  }

  /**
   * Tanlangan/nishonga olingan mahsulot yorlig'ini yanada yorqinroq qilish
   */
  public highlight(productId: string | null): void {
    this.labelsList.forEach((item) => {
      if (item.id === productId) {
        item.element.classList.add('highlighted');
      } else {
        item.element.classList.remove('highlighted');
      }
    });
  }

  /**
   * Har bir freymda foydalanuvchi kamerasigacha bo'lgan masofani tekshirib,
   * faqat uning oldiga borgandagina narxi va nomini ko'rsatish
   */
  public updateDistances(cameraPos: THREE.Vector3): void {
    for (let i = 0; i < this.labelsList.length; i++) {
      const item = this.labelsList[i];
      item.parentMesh.getWorldPosition(item.worldPos);
      const dist = cameraPos.distanceTo(item.worldPos);

      if (dist <= this.visibilityThreshold) {
        item.element.classList.remove('hidden-by-distance');
        // Masofaga qarab shaffoflik va masshtab (juda tabiiy ko'rinish)
        const alpha = Math.max(0, Math.min(1, 1 - (dist - 1.5) / (this.visibilityThreshold - 1.5)));
        item.element.style.opacity = `${0.3 + alpha * 0.7}`;
      } else {
        item.element.classList.add('hidden-by-distance');
      }
    }
  }

  public resize(width: number, height: number): void {
    this.labelRenderer.setSize(width, height);
  }

  public render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.labelRenderer.render(scene, camera);
  }
}
