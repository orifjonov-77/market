import * as THREE from 'three';

/**
 * O'yinchi va ob'ektlar to'qnashuvini (devorlar, javonlar) tekshiruvchi klass
 */
export class CollisionSystem {
  private shelfColliders: THREE.Box3[] = [];
  private roomBounds = {
    minX: -13.8,
    maxX: 13.8,
    minZ: -13.8,
    maxZ: 13.8
  };
  private playerRadius = 0.45; // O'yinchining to'qnashuv radiusi

  constructor(shelfColliders: THREE.Box3[]) {
    this.shelfColliders = shelfColliders;
  }

  /**
   * Berilgan pozitsiyani devor va javonlar to'siqlari bilan solishtirib xavfsiz pozitsiyani qaytaradi.
   * Sliding collision: devor bo'ylab sirg'alib yurish imkonini beradi.
   */
  public resolvePosition(currentPos: THREE.Vector3, desiredPos: THREE.Vector3): THREE.Vector3 {
    const finalPos = desiredPos.clone();

    // 1. Tashqi devorlar bilan to'qnashuvni cheklash
    finalPos.x = Math.max(this.roomBounds.minX, Math.min(this.roomBounds.maxX, finalPos.x));
    finalPos.z = Math.max(this.roomBounds.minZ, Math.min(this.roomBounds.maxZ, finalPos.z));

    // 2. Javonlar bilan to'qnashuv (AABB)
    // Avval X bo'yicha siljishni tekshiramiz
    const testPosX = new THREE.Vector3(finalPos.x, currentPos.y, currentPos.z);
    if (this.isCollidingWithShelves(testPosX)) {
      finalPos.x = currentPos.x; // X bo'yicha to'qnashdi, X ni bekor qilamiz
    }

    // Keyin Z bo'yicha siljishni tekshiramiz
    const testPosZ = new THREE.Vector3(finalPos.x, currentPos.y, finalPos.z);
    if (this.isCollidingWithShelves(testPosZ)) {
      finalPos.z = currentPos.z; // Z bo'yicha to'qnashdi, Z ni bekor qilamiz
    }

    return finalPos;
  }

  /**
   * Nuqta biror javon ichiga kirib qolganligini tekshirish
   */
  private isCollidingWithShelves(pos: THREE.Vector3): boolean {
    const playerBox = new THREE.Box3(
      new THREE.Vector3(pos.x - this.playerRadius, 0.1, pos.z - this.playerRadius),
      new THREE.Vector3(pos.x + this.playerRadius, 2.0, pos.z + this.playerRadius)
    );

    for (let i = 0; i < this.shelfColliders.length; i++) {
      if (playerBox.intersectsBox(this.shelfColliders[i])) {
        return true;
      }
    }
    return false;
  }
}
