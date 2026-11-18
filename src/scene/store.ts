import * as THREE from 'three';

/**
 * Haqiqiy KORZINKA Supermarketi Zali va Arxitekturasi:
 * - Oq-kulrang diagonal kafel va burchaklarida to'q romb toshlar
 * - Armstrong shifti, LED chiroqlar to'ri
 * - Korzinka kassa zonalari (orqada, z = 14 da, yurishga xalaqit bermaydi)
 * - Kirish/chiqish avtomat eshiklari va xarid aravachalari
 * - Ortiqcha yo'lni to'suvchi xatoliklar olib tashlangan, zal keng va yorug'
 */
export class StoreScene {
  public scene: THREE.Scene;
  public roomBounds = {
    minX: -22,
    maxX: 22,
    minZ: -22,
    maxZ: 22,
  };

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createEnvironment();
    this.createLighting();
    this.createKorzinkaCheckouts();
    this.createEntranceAndCarts();
  }

  private createEnvironment(): void {
    const roomSize = 46;

    // 1. ZAMIN (Yaltiroq toza supermarket kafel va romb naqshlari)
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const ctx = floorCanvas.getContext('2d')!;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 1024, 1024);
    ctx.beginPath();
    ctx.moveTo(512, 0); ctx.lineTo(512, 1024);
    ctx.moveTo(0, 512); ctx.lineTo(1024, 512);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    const drawDiamond = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx + size, cy);
      ctx.lineTo(cx, cy + size);
      ctx.lineTo(cx - size, cy);
      ctx.closePath();
      ctx.fill();
    };

    [0, 512, 1024].forEach((x) => {
      [0, 512, 1024].forEach((y) => {
        drawDiamond(x, y, 42);
      });
    });

    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(18, 18);
    floorTex.anisotropy = 16;

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.18,
      metalness: 0.08,
    });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. SHIFT
    const ceilingCanvas = document.createElement('canvas');
    ceilingCanvas.width = 512;
    ceilingCanvas.height = 512;
    const cCtx = ceilingCanvas.getContext('2d')!;
    cCtx.fillStyle = '#f1f5f9';
    cCtx.fillRect(0, 0, 512, 512);
    cCtx.strokeStyle = '#94a3b8';
    cCtx.lineWidth = 4;
    cCtx.strokeRect(0, 0, 512, 512);

    const ceilingTex = new THREE.CanvasTexture(ceilingCanvas);
    ceilingTex.wrapS = THREE.RepeatWrapping;
    ceilingTex.wrapT = THREE.RepeatWrapping;
    ceilingTex.repeat.set(22, 22);

    const ceilingMat = new THREE.MeshStandardMaterial({ map: ceilingTex, roughness: 0.85 });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5.6;
    this.scene.add(ceiling);

    // Shift ostidagi ventilyatsiya quvurlari
    const ductMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
    const duct1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, roomSize, 24), ductMat);
    duct1.rotation.z = Math.PI / 2;
    duct1.position.set(0, 5.2, -6);
    this.scene.add(duct1);

    const duct2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, roomSize, 24), ductMat);
    duct2.rotation.z = Math.PI / 2;
    duct2.position.set(0, 5.2, 6);
    this.scene.add(duct2);

    // 3. DEVORLAR
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const wallH = 5.6;

    const bWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallH, 0.4), wallMat);
    bWall.position.set(0, wallH / 2, -roomSize / 2);
    this.scene.add(bWall);

    const lWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, wallH, roomSize), wallMat);
    lWall.position.set(-roomSize / 2, wallH / 2, 0);
    this.scene.add(lWall);

    const rWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, wallH, roomSize), wallMat);
    rWall.position.set(roomSize / 2, wallH / 2, 0);
    this.scene.add(rWall);

    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 });
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(roomSize, 0.3, 0.5), plinthMat);
    plinth.position.set(0, 0.15, -roomSize / 2 + 0.1);
    this.scene.add(plinth);
  }

  private createLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.95);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.65);
    dirLight.position.set(12, 16, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    // Kassetali shift LED chiroqlari to'ri
    const lampGeo = new THREE.BoxGeometry(1.4, 0.04, 1.4);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    [-14, -7, 0, 7, 14].forEach((x) => {
      [-14, -7, 0, 7, 14].forEach((z) => {
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(x, 5.58, z);
        this.scene.add(lamp);

        const pLight = new THREE.PointLight(0xfffaed, 0.4, 14, 1.3);
        pLight.position.set(x, 5.2, z);
        this.scene.add(pLight);
      });
    });
  }

  /**
   * KASSA ZONASI (Devor oldida, o'tish yo'laklariga xalaqit bermaydi)
   */
  private createKorzinkaCheckouts(): void {
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });

    [-6, 0, 6].forEach((posX) => {
      const deskGroup = new THREE.Group();
      deskGroup.position.set(posX, 0, 16.5);

      const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.0, 1.1), counterMat);
      desk.position.set(0, 0.5, 0);
      deskGroup.add(desk);

      const belt = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.5), beltMat);
      belt.position.set(-0.5, 1.02, 0);
      deskGroup.add(belt);

      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.45, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      monitor.position.set(1.2, 1.45, 0);
      monitor.rotation.y = Math.PI;
      deskGroup.add(monitor);

      const posTerminal = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.12, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x2563eb })
      );
      posTerminal.position.set(1.1, 1.08, 0.3);
      deskGroup.add(posTerminal);

      this.scene.add(deskGroup);
    });
  }

  /**
   * ESHIK VA ARAVACHALAR
   */
  private createEntranceAndCarts(): void {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
      roughness: 0.05,
    });

    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.4, 0.2), frameMat);
    doorFrame.position.set(0, 1.7, 21.5);
    this.scene.add(doorFrame);

    const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(5.6, 3.0, 0.04), glassMat);
    doorGlass.position.set(0, 1.7, 21.5);
    this.scene.add(doorGlass);

    // Xarid aravachalari
    const cartMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });
    [-12, -11.2, -10.4].forEach((cartX) => {
      const cart = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.9), cartMat);
      cart.position.set(cartX, 0.45, 18);
      this.scene.add(cart);
    });

    const basketMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
    const basketStand = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), basketMat);
    basketStand.position.set(11, 0.4, 18);
    this.scene.add(basketStand);
  }
}
