import * as THREE from 'three';
import { ProductItem } from '../types';

/**
 * 2 ta rasmga 100% fotorealistik teksturalar:
 *
 * 1-qator (ICHIMLIKLAR VA SULAR):
 * 6-qavat: Nestlé Pure Life 1.5L
 * 5-qavat: Montella 1.5L
 * 4-qavat: Sprite 1.5L
 * 3-qavat: Fanta Orange 1.5L
 * 2-qavat: Coca-Cola 1.5L
 * 1-qavat: Pepsi 1.5L
 *
 * 2-qator (SHIRINLIKLAR VA PECHYONELAR):
 * 6-qavat: Twix Xtra (oltinrang porloq qadoq, qizil "Twix" harflari)
 * 5-qavat: Lotte Choco-Pie (qizil quti, oq "Lotte", pechenye tasviri)
 * 4-qavat: Oreo (to'q ko'k qadoq, oq "OREO", ikkita qora pechenye)
 * 3-qavat: Nutella 350g (oq qopqoqli banka, qora 'n', qizil 'utella', shokoladli non)
 * 2-qavat: Milka (binafsharang quti, oq "Milka" va mashhur oq-binafsha sigir tasviri)
 * 1-qavat: Snickers (to'q shokolad rangi, oq fonda to'q ko'k qalin "SNICKERS")
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
      // SHIRINLIKLAR BO'LIMI:
      case 'twix':
        this.drawTwix(ctx, width, height);
        break;
      case 'chocopie':
        this.drawChocoPie(ctx, width, height);
        break;
      case 'oreo':
        this.drawOreo(ctx, width, height);
        break;
      case 'nutella':
        this.drawNutella(ctx, width, height);
        break;
      case 'milka':
        this.drawMilka(ctx, width, height);
        break;
      case 'snickers':
        this.drawSnickers(ctx, width, height);
        break;

      // ICHIMLIKLAR VA SULAR BO'LIMI:
      case 'nestle':
        this.drawNestle(ctx, width, height);
        break;
      case 'montella':
        this.drawMontella(ctx, width, height);
        break;
      case 'sprite':
        this.drawSprite(ctx, width, height);
        break;
      case 'fanta':
        this.drawFanta(ctx, width, height);
        break;
      case 'cola':
        this.drawCola(ctx, width, height);
        break;
      case 'pepsi':
        this.drawPepsi(ctx, width, height);
        break;

      default:
        this.drawGeneric(ctx, width, height, product);
        break;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set(key, texture);
    return texture;
  }

  // ==========================================
  // 🍫 SHIRINLIKLAR VA PECHYONELAR (100% RASM)
  // ==========================================

  // 1. TWIX (Oltinrang metallik yaltiroq qadoq, qizil "Twix" qalin shrifti)
  private static drawTwix(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.3, '#fde047');
    grad.addColorStop(0.7, '#f59e0b');
    grad.addColorStop(1, '#b45309');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Oltin ramka
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(15, 15, w - 30, h - 30);

    // Oq soya va qizil "Twix"
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 120px "Arial Black", "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Twix', w / 2 + 5, h * 0.5 + 5);

    ctx.fillStyle = '#dc2626';
    ctx.fillText('Twix', w / 2, h * 0.5);

    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('XTRA • 75g', w / 2, h * 0.85);
  }

  // 2. LOTTE CHOCO-PIE (To'q qizil quti, oq "Lotte", sariq "Choco-Pie", pechenye)
  private static drawChocoPie(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(0, 0, w, h);

    // Oq fonli "LOTTE"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('LOTTE', 50, h * 0.25);

    // Choco-Pie yozuvi
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 78px "Arial Black", sans-serif';
    ctx.fillText('Choco', 50, h * 0.52);

    ctx.fillStyle = '#fde047';
    ctx.fillText('Pie', 350, h * 0.52);

    // Dumaloq shokoladli pechenye tasviri (o'ng tomonda)
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(w - 180, h * 0.5, 100, 0, Math.PI * 2);
    ctx.fill();

    // Oq biskvit kremi qatlami
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(w - 280, h * 0.46, 200, 18);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('12 PACK • 360g', w / 2, h * 0.88);
  }

  // 3. OREO (To'q ko'k rang, oq qalin "OREO", qora kremli pechenyelar)
  private static drawOreo(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const bgGrad = ctx.createLinearGradient(0, 0, w, 0);
    bgGrad.addColorStop(0, '#0055a5');
    bgGrad.addColorStop(0.5, '#0072ce');
    bgGrad.addColorStop(1, '#0055a5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Ikkita qora Oreo pechenyesi tasviri
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(w * 0.25, h * 0.55, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(w * 0.75, h * 0.55, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Markaziy OREO logotipi
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 110px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OREO', w / 2, h * 0.48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('ORIGINAL 154g', w / 2, h * 0.85);
  }

  // 4. NUTELLA (Oq banka foni, qora 'n', qizil 'utella', yong'oq va non)
  private static drawNutella(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Non ustiga surtilgan shokolad
    ctx.fillStyle = '#5c2c16';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.78, 160, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    // nutella yozuvi
    ctx.font = '900 96px "Arial Black", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000000';
    ctx.fillText('n', w / 2 - 60, h * 0.42);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('utella', w / 2 - 58, h * 0.42);

    ctx.fillStyle = '#4b5563';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FERRERO • 350g', w / 2, h * 0.18);
  }

  // 5. MILKA (Binafsharang fon, oq "Milka", oq-binafsha sigir silueti)
  private static drawMilka(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, 0, w, h);

    // Tog'lar
    ctx.fillStyle = '#9061f9';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w * 0.3, h * 0.4);
    ctx.lineTo(w * 0.6, h * 0.68);
    ctx.lineTo(w * 0.85, h * 0.32);
    ctx.lineTo(w, h * 0.8);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Milka mashhur oq sigir silueti
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(w * 0.75, h * 0.65, 60, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 110px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Milka', w / 2, h * 0.42);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('Alpenmilch 100g', w / 2, h * 0.86);
  }

  // 6. SNICKERS (To'q jigarrang fon, oq to'rtburchak, ko'k qalin "SNICKERS")
  private static drawSnickers(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#381604';
    ctx.fillRect(0, 0, w, h);

    // Oq to'rtburchak
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(35, h * 0.22, w - 70, h * 0.56);

    // Ko'k hoshiya
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 10;
    ctx.strokeRect(48, h * 0.22 + 8, w - 96, h * 0.56 - 16);

    ctx.fillStyle = '#1e40af';
    ctx.font = 'italic 900 96px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SNICKERS', w / 2, h * 0.5);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('YONG\'OQ VA KARAMEL (SUPER 80g)', w / 2, h * 0.9);
  }

  // ==========================================
  // 🥤 ICHIMLIKLAR VA SULAR (100% RASM)
  // ==========================================

  private static drawNestle(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#005a9c');
    grad.addColorStop(0.5, '#0072ce');
    grad.addColorStop(1, '#005a9c');
    ctx.fillStyle = grad;
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

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('1.5 L', w / 2, h * 0.86);
  }

  private static drawMontella(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.lineTo(w * 0.25, h * 0.28);
    ctx.lineTo(w * 0.5, h * 0.52);
    ctx.lineTo(w * 0.78, h * 0.22);
    ctx.lineTo(w, h * 0.6);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = '900 68px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Montella', w / 2, h * 0.52);

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('NATURAL MINERAL WATER 1.5L', w / 2, h * 0.8);
  }

  private static drawSprite(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#008b47';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#fbee21';
    ctx.beginPath();
    ctx.arc(w / 2 + 80, h * 0.34, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 84px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sprite', w / 2, h * 0.48);

    ctx.fillStyle = '#fbee21';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('1.5 L', w / 2, h * 0.82);
  }

  private static drawFanta(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(w / 2 + 80, h * 0.24, 50, 24, Math.PI / 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.5, 170, 70, -0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 82px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FANTA', w / 2, h * 0.5);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('ORANGE 1.5L', w / 2, h * 0.84);
  }

  private static drawCola(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#990000');
    grad.addColorStop(0.5, '#e11d48');
    grad.addColorStop(1, '#990000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.bezierCurveTo(w * 0.3, h * 0.92, w * 0.7, h * 0.42, w, h * 0.68);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 92px "Brush Script MT", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Coca-Cola', w / 2, h * 0.42);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('ORIGINAL TASTE 1.5L', w / 2, h * 0.85);
  }

  private static drawPepsi(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const bgGrad = ctx.createLinearGradient(0, 0, w, 0);
    bgGrad.addColorStop(0, '#003a7a');
    bgGrad.addColorStop(0.5, '#005cb9');
    bgGrad.addColorStop(1, '#003a7a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.5;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let radius = 140; radius <= 250; radius += 14) {
      const dotCount = Math.floor(radius / 2.6);
      for (let i = 0; i < dotCount; i++) {
        const ang = (i / dotCount) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const r = h * 0.36;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e31b23';
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0033a0';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx - r, cy - 10);
    ctx.bezierCurveTo(cx - r * 0.35, cy - 35, cx + r * 0.35, cy + 25, cx + r, cy);
    ctx.lineTo(cx + r, cy + 30);
    ctx.bezierCurveTo(cx + r * 0.35, cy + 55, cx - r * 0.35, cy - 5, cx - r, cy + 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.font = '900 66px "Arial Black", "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PEPSI', cx, cy + 8);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('1.5 L', w - 40, h - 25);
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
