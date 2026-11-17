import * as THREE from 'three';

/**
 * Supermarketning yuqori sifatli (Ultra Realistic) zali:
 * - Oq-kulrang diagonal kafel va burchaklarida to'q romb naqshlari
 * - Armstrong kassetali shifti va yorqin LED panellari
 * - Oq devorlar, to'q qizil supermarket plintuslari
 * - Devorlardagi supermarket bo'limlari belgilari va kassa zonalari
 */
export class StoreScene {
  public scene: THREE.Scene;
  public roomBounds = {
    minX: -18,
    maxX: 18,
    minZ: -18,
    maxZ: 18,
  };

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createEnvironment();
    this.createLighting();
    this.createCheckoutArea();
  }

  private createEnvironment(): void {
    const roomSize = 40;

    // 1. ZAMIN (Kafel plitkalar: oq-kulrang yaltiroq marmarsimon kafel va qora rombik toshlar)
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const ctx = floorCanvas.getContext('2d')!;

    // Asosiy kafel foni (toza oqish-kulrang marmar)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 1024);

    // Kafel choklari (ingichka kulrang chiziqlar)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 1024, 1024);
    ctx.beginPath();
    ctx.moveTo(512, 0);
    ctx.lineTo(512, 1024);
    ctx.moveTo(0, 512);
    ctx.lineTo(1024, 512);
    ctx.stroke();

    // Rombik toshlar (rasmning polidagi burchak qora toshlari)
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

    drawDiamond(0, 0, 50);
    drawDiamond(1024, 0, 50);
    drawDiamond(0, 1024, 50);
    drawDiamond(1024, 1024, 50);
    drawDiamond(512, 512, 50);
    drawDiamond(512, 0, 40);
    drawDiamond(0, 512, 40);
    drawDiamond(1024, 512, 40);
    drawDiamond(512, 1024, 40);

    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(16, 16);
    floorTex.anisotropy = 16;

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.18, // Yaltiroq toza pol
      metalness: 0.08,
    });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. SHIFT (Armstrong kvadrat panellari)
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
    ceilingTex.repeat.set(20, 20);

    const ceilingMat = new THREE.MeshStandardMaterial({
      map: ceilingTex,
      roughness: 0.85,
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5.4;
    this.scene.add(ceiling);

    // 3. DEVORLAR
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
    });
    const wallH = 5.4;

    // Orqa
    const bWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallH, 0.4), wallMat);
    bWall.position.set(0, wallH / 2, -roomSize / 2);
    this.scene.add(bWall);

    // Old
    const fWall = new THREE.Mesh(new THREE.BoxGeometry(roomSize, wallH, 0.4), wallMat);
    fWall.position.set(0, wallH / 2, roomSize / 2);
    this.scene.add(fWall);

    // Chap
    const lWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, wallH, roomSize), wallMat);
    lWall.position.set(-roomSize / 2, wallH / 2, 0);
    this.scene.add(lWall);

    // O'ng
    const rWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, wallH, roomSize), wallMat);
    rWall.position.set(roomSize / 2, wallH / 2, 0);
    this.scene.add(rWall);

    // Pastki to'q qizil plintus
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 });
    const plinth1 = new THREE.Mesh(new THREE.BoxGeometry(roomSize, 0.3, 0.5), plinthMat);
    plinth1.position.set(0, 0.15, -roomSize / 2 + 0.1);
    this.scene.add(plinth1);
  }

  /**
   * Supermarket kassetali shift chiroqlari va tabiiy kunduzgi yorug'lik
   */
  private createLighting(): void {
    // 1. Muhit nuri
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambient);

    // 2. Asosiy yo'naltirilgan nur (Yumshoq soyalar bilan)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 16, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 45;
    dirLight.shadow.camera.left = -22;
    dirLight.shadow.camera.right = 22;
    dirLight.shadow.camera.top = 22;
    dirLight.shadow.camera.bottom = -22;
    dirLight.shadow.bias = -0.0003;
    this.scene.add(dirLight);

    // 3. Shiftga o'rnatilgan kvadrat kassetali LED chiroqlar to'ri (Armstrong panellar)
    const lampGeo = new THREE.BoxGeometry(1.4, 0.04, 1.4);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const coords = [-12, -6, 0, 6, 12];
    coords.forEach((x) => {
      coords.forEach((z) => {
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(x, 5.38, z);
        this.scene.add(lamp);

        // Har bir chiroqdan yumshoq oq nur
        const pLight = new THREE.PointLight(0xfffaed, 0.3, 11, 1.3);
        pLight.position.set(x, 5.0, z);
        this.scene.add(pLight);
      });
    });
  }

  /**
   * Kassa stoli va savatlar
   */
  private createCheckoutArea(): void {
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 });
    const counterTopMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

    const desk = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.1, 1.6), counterMat);
    desk.position.set(0, 0.55, 14.5);
    desk.castShadow = true;
    desk.receiveShadow = true;
    this.scene.add(desk);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.08, 1.7), counterTopMat);
    deskTop.position.set(0, 1.14, 14.5);
    this.scene.add(deskTop);

    // Kassa kompyuteri va monitori
    const monitor = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.65, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    monitor.position.set(0, 1.6, 14.5);
    monitor.rotation.y = Math.PI;
    this.scene.add(monitor);
  }
}
