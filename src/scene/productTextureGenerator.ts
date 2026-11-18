import * as THREE from 'three';
import { ProductItem } from '../types';

/**
 * Haqiqiy KORZINKA supermarketidagi barcha 8 ta bo'lim mahsulotlarining
 * 100% fotorealistik HD etiketka va qadoq teksturalarini chizuvchi factory.
 */
export class ProductTextureGenerator {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  public static getTexture(product: ProductItem, width = 1024, height = 512): THREE.CanvasTexture {
    const key = `${product.id}_${width}x${height}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    switch (product.brand) {
      // 1. ICHIMLIKLAR VA SUVLAR
      case 'nestle': this.drawNestle(ctx, width, height); break;
      case 'montella': this.drawMontella(ctx, width, height); break;
      case 'cola': this.drawCola(ctx, width, height); break;
      case 'pepsi': this.drawPepsi(ctx, width, height); break;
      case 'fanta': this.drawFanta(ctx, width, height); break;
      case 'sprite': this.drawSprite(ctx, width, height); break;

      // 2. SHIRINLIKLAR VA SHOKOLADLAR
      case 'twix': this.drawTwix(ctx, width, height); break;
      case 'snickers': this.drawSnickers(ctx, width, height); break;
      case 'milka': this.drawMilka(ctx, width, height); break;
      case 'oreo': this.drawOreo(ctx, width, height); break;
      case 'nutella': this.drawNutella(ctx, width, height); break;
      case 'chocopie': this.drawChocoPie(ctx, width, height); break;
      case 'kitkat': this.drawKitKat(ctx, width, height); break;

      // 3. SUT MAHSULOTLARI
      case 'milk_kamilka': this.drawKamilka(ctx, width, height); break;
      case 'milk_musaffo': this.drawMusaffo(ctx, width, height); break;
      case 'kefir': this.drawKefir(ctx, width, height); break;
      case 'sourcream': this.drawSourCream(ctx, width, height); break;
      case 'president': this.drawPresident(ctx, width, height); break;
      case 'cheese': this.drawCheese(ctx, width, height); break;

      // 4. NON VA PISHIRIQLAR
      case 'lepeshka': this.drawBread(ctx, width, height, 'SAMARQAND NONI'); break;
      case 'patir': this.drawBread(ctx, width, height, 'YOG\'LI PATIR'); break;
      case 'croissant': this.drawCroissant(ctx, width, height); break;
      case 'baguette': this.drawBaguette(ctx, width, height); break;

      // 5. MEVA VA SABZAVOTLAR
      case 'produce_apple': this.drawProduce(ctx, width, height, '#dc2626', 'SHIRIN QIZIL OLMA'); break;
      case 'produce_banana': this.drawProduce(ctx, width, height, '#facc15', 'BANAN EKVADOR'); break;
      case 'produce_orange': this.drawProduce(ctx, width, height, '#ea580c', 'APELSIN SUVLI'); break;
      case 'produce_potato': this.drawProduce(ctx, width, height, '#a16207', 'KARTOSHKA TOZA'); break;
      case 'produce_tomato': this.drawProduce(ctx, width, height, '#ef4444', 'YUSUPOV POMIDOR'); break;
      case 'produce_cucumber': this.drawProduce(ctx, width, height, '#15803d', 'BODRING ORZU'); break;

      // 6. GO'SHT VA MUZLATILGAN MAHSULOTLAR
      case 'frozen_chicken': this.drawFrozen(ctx, width, height, '#0284c7', 'TOVUQ GO\'SHTI', '100% HALOL'); break;
      case 'frozen_beef': this.drawFrozen(ctx, width, height, '#991b1b', 'MOL GO\'SHTI LAHM', 'SARALANGAN'); break;
      case 'frozen_dumplings': this.drawFrozen(ctx, width, height, '#2563eb', 'CHUCHVARA MAZALI', '800g'); break;
      case 'frozen_veg': this.drawFrozen(ctx, width, height, '#16a34a', 'SABZAVOTLAR MIX', '400g'); break;

      // 7. BAQQOLLIK MAHSULOTLARI
      case 'oil': this.drawOil(ctx, width, height); break;
      case 'rice': this.drawRice(ctx, width, height); break;
      case 'makfa': this.drawMakfa(ctx, width, height); break;
      case 'tea': this.drawTea(ctx, width, height); break;
      case 'nescafe': this.drawNescafe(ctx, width, height); break;
      case 'flour': this.drawFlour(ctx, width, height); break;
      case 'tuna': this.drawTuna(ctx, width, height); break;
      case 'corn': this.drawBonduelle(ctx, width, height, 'SHIRIN JO\'XORI 340g'); break;

      // 8. MAISHIY KIMYO VA TOZALIK
      case 'tide': this.drawTide(ctx, width, height); break;
      case 'fairy': this.drawFairy(ctx, width, height); break;
      case 'domestos': this.drawDomestos(ctx, width, height); break;
      case 'papia': this.drawPapia(ctx, width, height); break;

      default: this.drawGeneric(ctx, width, height, product); break;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set(key, texture);
    return texture;
  }

  // --- MAISHIY KIMYO ---
  private static drawTide(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#ea580c');
    grad.addColorStop(0.5, '#f97316');
    grad.addColorStop(1, '#ea580c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Oq va ko'k konsentrik doiralar (Tide bullseye nishoni)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.48, 140, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.48, 105, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.48, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 110px "Impact", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Tide', w / 2, h * 0.48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('AVTOMAT • COLOR 3kg', w / 2, h * 0.86);
  }

  private static drawFairy(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.48, 130, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#dc2626';
    ctx.font = '900 84px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FAIRY', w / 2, h * 0.45);

    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('SOCHUQ VA YALPIZ 900ml', w / 2, h * 0.62);
  }

  private static drawDomestos(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, h * 0.3, w, h * 0.38);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 80px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DOMESTOS', w / 2, h * 0.49);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('QO\'SH QUVVATLI GEL 1L', w / 2, h * 0.82);
  }

  private static drawPapia(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ec4899';
    ctx.fillRect(0, h * 0.25, w, h * 0.45);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 96px "Brush Script MT", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Papia', w / 2, h * 0.46);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('3 QAVATLI YUMSHOQ • 8 DONA', w / 2, h * 0.85);
  }

  // --- MUZLATILGAN GO'SHT VA MAXSULOTLAR ---
  private static drawFrozen(ctx: CanvasRenderingContext2D, w: number, h: number, headerColor: string, title: string, sub: string): void {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = headerColor;
    ctx.fillRect(0, 0, w, h * 0.42);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('KORZINKA FRESH', w / 2, h * 0.22);

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 52px sans-serif';
    ctx.fillText(title, w / 2, h * 0.62);

    ctx.fillStyle = '#16a34a';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(sub, w / 2, h * 0.82);
  }

  // --- MEVA VA SABZAVOTLAR ---
  private static drawProduce(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, title: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(20, 20, w - 40, h - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 58px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, w / 2, h * 0.5);
  }

  // --- NON VA PISHIRIQLAR ---
  private static drawBread(ctx: CanvasRenderingContext2D, w: number, h: number, title: string): void {
    const grad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w / 2);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#d97706');
    grad.addColorStop(1, '#78350f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Chekich naqshi
    ctx.fillStyle = '#451a03';
    for (let i = 0; i < 40; i++) {
      const ang = (i / 40) * Math.PI * 2;
      ctx.fillRect(w / 2 + Math.cos(ang) * 90, h / 2 + Math.sin(ang) * 90, 6, 6);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, w / 2, h * 0.9);
  }

  private static drawCroissant(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fde68a';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SHOKOLADLI KRUASSAN', w / 2, h * 0.5);
  }

  private static drawBaguette(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fef3c7';
    ctx.font = '900 54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FRANSUZ BAGETI', w / 2, h * 0.5);
  }

  // --- SUT MAHSULOTLARI ---
  private static drawKamilka(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, w, h * 0.38);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KAMILKA', w / 2, h * 0.24);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('TABIIY SUT 3.2% 1L', w / 2, h * 0.65);
  }

  private static drawMusaffo(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, w, h * 0.4);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 74px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('Musaffo', w / 2, h * 0.26);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('SUT 2.5% • 1L', w / 2, h * 0.65);
  }

  private static drawKefir(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#059669';
    ctx.fillRect(0, 0, w, h * 0.35);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BIO KEFIR 1L', w / 2, h * 0.22);
  }

  private static drawSourCream(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, h * 0.2, w, h * 0.5);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SMETANA 20% 350g', w / 2, h * 0.48);
  }

  private static drawPresident(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, w, h * 0.38);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px serif';
    ctx.textAlign = 'center';
    ctx.fillText('PRÉSIDENT', w / 2, h * 0.24);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText('SARIYOG\' 82.5%', w / 2, h * 0.65);
  }

  private static drawCheese(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#92400e';
    ctx.font = '900 58px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOLLAND PISHLOG\'I 300g', w / 2, h * 0.5);
  }

  // --- SHIRINLIKLAR ---
  private static drawTwix(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.3, '#fde047');
    grad.addColorStop(0.7, '#f59e0b');
    grad.addColorStop(1, '#b45309');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#dc2626';
    ctx.font = '900 120px "Arial Black", "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Twix', w / 2, h * 0.5);
  }

  private static drawSnickers(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#381604';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(35, h * 0.22, w - 70, h * 0.56);
    ctx.fillStyle = '#1e40af';
    ctx.font = 'italic 900 96px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SNICKERS', w / 2, h * 0.5);
  }

  private static drawMilka(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 110px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Milka', w / 2, h * 0.5);
  }

  private static drawOreo(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#0055a5';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 110px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OREO', w / 2, h * 0.5);
  }

  private static drawNutella(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.font = '900 96px "Arial Black", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000000';
    ctx.fillText('n', w / 2 - 60, h * 0.5);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('utella', w / 2 - 58, h * 0.5);
  }

  private static drawChocoPie(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 78px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Choco-Pie', w / 2, h * 0.52);
  }

  private static drawKitKat(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.5, 180, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.font = 'italic 900 84px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('KitKat', w / 2, h * 0.5);
  }

  // --- ICHIMLIKLAR ---
  private static drawNestle(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#0072ce';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.48, 180, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#005a9c';
    ctx.font = '900 56px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Nestle', w / 2, h * 0.38);
    ctx.fillStyle = '#00a3e0';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Pure Life', w / 2, h * 0.58);
  }

  private static drawMontella(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0284c7';
    ctx.font = '900 68px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Montella', w / 2, h * 0.52);
  }

  private static drawSprite(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#008b47';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 84px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sprite', w / 2, h * 0.48);
  }

  private static drawFanta(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 82px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FANTA', w / 2, h * 0.5);
  }

  private static drawCola(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 92px "Brush Script MT", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Coca-Cola', w / 2, h * 0.42);
  }

  private static drawPepsi(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#005cb9';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h * 0.5;
    const r = h * 0.36;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e31b23';
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#0033a0';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI, false);
    ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.font = '900 66px "Arial Black", "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PEPSI', cx, cy + 8);
  }

  // --- BAQQOLLIK ---
  private static drawOil(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OLTIN KALIT 1L', w / 2, h * 0.5);
  }

  private static drawRice(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, w, h * 0.35);
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LAZER GURUCH 1kg', w / 2, h * 0.65);
  }

  private static drawMakfa(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#dc2626';
    ctx.font = '900 78px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MAKFA', w / 2, h * 0.52);
  }

  private static drawTea(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 90px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TESS', w / 2, h * 0.46);
  }

  private static drawNescafe(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 72px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NESCAFE.', w / 2, h * 0.5);
  }

  private static drawFlour(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#78350f';
    ctx.font = '900 60px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OLTIN DON 2kg', w / 2, h * 0.5);
  }

  private static drawTuna(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TUNES TUNA 185g', w / 2, h * 0.5);
  }

  private static drawBonduelle(ctx: CanvasRenderingContext2D, w: number, h: number, title: string): void {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 66px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Bonduelle', w / 2, h * 0.45);
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(title, w / 2, h * 0.75);
  }

  private static drawGeneric(ctx: CanvasRenderingContext2D, w: number, h: number, p: ProductItem): void {
    ctx.fillStyle = p.color;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 52px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.name, w / 2, h * 0.5);
  }
}
