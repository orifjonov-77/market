import * as THREE from 'three';
import { ProductItem } from '../types';

/**
 * Supermarketdagi har bir mahsulot uchun 100% haqiqiy, aniq ajralib turadigan
 * foto-realistik qadoq va etiketka teksturalari generatori.
 * Market egalari va xaridorlar ko'rganda qaysi mahsulot ekanligini bir qarashda darhol biladi!
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
      case 'pepsi':
        this.drawPepsi(ctx, width, height);
        break;
      case 'cola':
        this.drawCocaCola(ctx, width, height);
        break;
      case 'fanta':
        this.drawFanta(ctx, width, height);
        break;
      case 'sprite':
        this.drawSprite(ctx, width, height);
        break;
      case 'water':
        this.drawWater(ctx, width, height, product.name);
        break;
      case 'dena':
        this.drawJuice(ctx, width, height, product);
        break;
      case 'snickers':
        this.drawSnickers(ctx, width, height);
        break;
      case 'milka':
        this.drawMilka(ctx, width, height);
        break;
      case 'nutella':
        this.drawNutella(ctx, width, height);
        break;
      case 'oreo':
        this.drawOreo(ctx, width, height);
        break;
      case 'chocopie':
        this.drawChocoPie(ctx, width, height);
        break;
      case 'tuna':
        this.drawTuna(ctx, width, height, product.name);
        break;
      case 'corn':
      case 'peas':
        this.drawBonduelle(ctx, width, height, product.name);
        break;
      case 'pickles':
      case 'olives':
        this.drawJar(ctx, width, height, product);
        break;
      case 'oil':
        this.drawOil(ctx, width, height);
        break;
      case 'makfa':
        this.drawMakfa(ctx, width, height);
        break;
      case 'tea':
        this.drawTea(ctx, width, height);
        break;
      case 'nescafe':
        this.drawNescafe(ctx, width, height);
        break;
      case 'rice':
        this.drawGrain(ctx, width, height, product.name);
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

  // 1. PEPSI (100% rasmiy rasm bilan bir xil dizayn)
  private static drawPepsi(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const bgGrad = ctx.createLinearGradient(0, 0, w, 0);
    bgGrad.addColorStop(0, '#003a7a');
    bgGrad.addColorStop(0.5, '#005cb9');
    bgGrad.addColorStop(1, '#003a7a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.5;

    // Nur taraluvchi nuqtalar to'lqini
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

    // Doiraviy globus logo
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

    // Oq to'lqin lentasi
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx - r, cy - 10);
    ctx.bezierCurveTo(cx - r * 0.35, cy - 35, cx + r * 0.35, cy + 25, cx + r, cy);
    ctx.lineTo(cx + r, cy + 30);
    ctx.bezierCurveTo(cx + r * 0.35, cy + 55, cx - r * 0.35, cy - 5, cx - r, cy + 20);
    ctx.closePath();
    ctx.fill();

    // Qora qalin PEPSI yozuvi
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

  // 2. COCA-COLA
  private static drawCocaCola(ctx: CanvasRenderingContext2D, w: number, h: number): void {
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
    ctx.font = 'italic 900 90px "Brush Script MT", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Coca-Cola', w / 2, h * 0.42);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('ORIGINAL TASTE 1.5L', w / 2, h * 0.84);
  }

  // 3. FANTA
  private static drawFanta(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(w / 2 + 80, h * 0.22, 50, 24, Math.PI / 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.48, 170, 70, -0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 80px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FANTA', w / 2, h * 0.48);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('ORANGE 1.5L', w / 2, h * 0.82);
  }

  // 4. SPRITE
  private static drawSprite(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(w / 2 + 80, h * 0.34, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 84px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sprite', w / 2, h * 0.48);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('LIMON & LAYM 1.5L', w / 2, h * 0.82);
  }

  // 5. SUVLAR (Montella / Nestlé)
  private static drawWater(ctx: CanvasRenderingContext2D, w: number, h: number, name: string): void {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#0369a1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Qorli tog' silueti
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.6);
    ctx.lineTo(w * 0.35, h * 0.28);
    ctx.lineTo(w * 0.6, h * 0.48);
    ctx.lineTo(w * 0.8, h * 0.22);
    ctx.lineTo(w * 0.95, h * 0.6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = '900 52px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name.split(' ')[0].toUpperCase(), w / 2, h * 0.64);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('TOZA BULOQ SUVI 1.5L', w / 2, h * 0.8);
  }

  // 6. SHARBATLAR (Dena / Bliss)
  private static drawJuice(ctx: CanvasRenderingContext2D, w: number, h: number, p: ProductItem): void {
    ctx.fillStyle = p.color;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, h * 0.25, w, h * 0.45);

    ctx.fillStyle = '#15803d';
    ctx.font = '900 68px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.name.split(' ')[0].toUpperCase(), w / 2, h * 0.45);

    ctx.fillStyle = p.color;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(p.name.split(' ').slice(1).join(' '), w / 2, h * 0.6);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('100% TABIIY MEVA SHARBAT 1L', w / 2, h * 0.85);
  }

  // 7. SNICKERS
  private static drawSnickers(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, h * 0.22, w - 80, h * 0.55);

    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 8;
    ctx.strokeRect(50, h * 0.22 + 8, w - 100, h * 0.55 - 16);

    ctx.fillStyle = '#1e40af';
    ctx.font = 'italic 900 88px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SNICKERS', w / 2, h * 0.5);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('YONG\'OQ VA KARAMEL (SUPER 80g)', w / 2, h * 0.88);
  }

  // 8. MILKA
  private static drawMilka(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#9061f9';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.lineTo(w * 0.3, h * 0.35);
    ctx.lineTo(w * 0.6, h * 0.65);
    ctx.lineTo(w * 0.85, h * 0.3);
    ctx.lineTo(w, h * 0.75);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 96px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Milka', w / 2, h * 0.44);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('Alpin Milch 100g', w / 2, h * 0.84);
  }

  // 9. NUTELLA
  private static drawNutella(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#653818';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.78, 140, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '900 82px "Arial Black", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000000';
    ctx.fillText('n', w / 2 - 50, h * 0.44);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('utella', w / 2 - 48, h * 0.44);

    ctx.fillStyle = '#4b5563';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FERRERO 350g', w / 2, h * 0.2);
  }

  // 10. OREO
  private static drawOreo(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.5, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.5, 100, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 78px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OREO', w / 2, h * 0.5);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('ORIGINAL 154g', w / 2, h * 0.86);
  }

  // 11. CHOCO-PIE
  private static drawChocoPie(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LOTTE', w / 2, h * 0.25);

    ctx.fillStyle = '#fde047';
    ctx.font = '900 72px "Arial Black", sans-serif';
    ctx.fillText('Choco-Pie', w / 2, h * 0.48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('12 DONA • 360g', w / 2, h * 0.8);
  }

  // 12. BALIQ KONSERVASI (Tunes / Sardina)
  private static drawTuna(ctx: CanvasRenderingContext2D, w: number, h: number, name: string): void {
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, h * 0.25, w, h * 0.5);

    ctx.fillStyle = '#0284c7';
    ctx.font = '900 56px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name.split(' ')[0].toUpperCase(), w / 2, h * 0.48);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(name.split(' ').slice(1).join(' '), w / 2, h * 0.65);
  }

  // 13. BONDUELLE KONSERVA (Jo'xori / No'xat)
  private static drawBonduelle(ctx: CanvasRenderingContext2D, w: number, h: number, name: string): void {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, h * 0.22, w, h * 0.42);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 58px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Bonduelle', w / 2, h * 0.48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(name, w / 2, h * 0.84);
  }

  // 14. BANKALAR (Bodring / Zaytun)
  private static drawJar(ctx: CanvasRenderingContext2D, w: number, h: number, p: ProductItem): void {
    ctx.fillStyle = p.color;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(20, h * 0.25, w - 40, h * 0.5);

    ctx.fillStyle = '#1e293b';
    ctx.font = '900 46px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.name, w / 2, h * 0.52);
  }

  // 15. OLTIN KALIT YOG'I
  private static drawOil(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#b45309';
    ctx.fillRect(20, 20, w - 40, h - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OLTIN KALIT', w / 2, h * 0.42);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('PISTA YOG\'I 1L', w / 2, h * 0.68);
  }

  // 16. MAKFA SPAGETTI
  private static drawMakfa(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#facc15';
    ctx.fillRect(20, h * 0.3, w - 40, h * 0.38);

    ctx.fillStyle = '#dc2626';
    ctx.font = '900 68px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MAKFA', w / 2, h * 0.52);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('SPAGETTI 500g', w / 2, h * 0.85);
  }

  // 17. TESS CHOY
  private static drawTea(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 78px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TESS', w / 2, h * 0.46);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('CEYLON BLACK TEA 100g', w / 2, h * 0.78);
  }

  // 18. NESCAFE
  private static drawNescafe(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, h * 0.25, w, h * 0.42);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NESCAFE.', w / 2, h * 0.5);

    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('Classic 100g', w / 2, h * 0.84);
  }

  // 19. GURUCH / UN / SHAKAR
  private static drawGrain(ctx: CanvasRenderingContext2D, w: number, h: number, name: string): void {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, w, h * 0.35);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SUPERMARKET', w / 2, h * 0.22);

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 52px sans-serif';
    ctx.fillText(name, w / 2, h * 0.65);
  }

  // 20. STANDART
  private static drawGeneric(ctx: CanvasRenderingContext2D, w: number, h: number, p: ProductItem): void {
    ctx.fillStyle = p.color;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.name, w / 2, h * 0.5);
  }
}
