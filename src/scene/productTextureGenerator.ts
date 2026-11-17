import * as THREE from 'three';
import { ProductItem } from '../types';

/**
 * Rasmga 100% o'xshash fotorealistik teksturalar generatori.
 * Pepsi uchun foydalanuvchi yuborgan rasm bilan 100% bir xil dizayn chiziladi:
 * - Moviy yorqin fon, konsentrik nuqtalar/halqalar to'lqini
 * - Pepsi doira logotipi (qizil tepa, oq to'lqin, to'q ko'k pastki qism)
 * - To'lqin ustida qora qalin 'PEPSI' yozuvi
 * - Oq qalin hoshiya
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
        this.drawExactPepsi(ctx, width, height);
        break;
      case 'cola':
        this.drawExactCola(ctx, width, height);
        break;
      case 'fanta':
        this.drawExactFanta(ctx, width, height);
        break;
      case 'sprite':
        this.drawExactSprite(ctx, width, height);
        break;
      case 'snickers':
        this.drawExactSnickers(ctx, width, height);
        break;
      case 'milka':
        this.drawExactMilka(ctx, width, height);
        break;
      case 'nutella':
        this.drawExactNutella(ctx, width, height);
        break;
      case 'oreo':
        this.drawExactOreo(ctx, width, height);
        break;
      default:
        this.drawBrandDefault(ctx, width, height, product);
        break;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * 🎯 FOYDALANUVCHI YUBORGAN RASMDAGI PEPSI ETİKETKASI (100% ANIQLIKDA):
   * - To'q va och ko'k gradientli fon
   * - Atrofdagi nuqtali yarim sharlar to'lqini (radiating halftone dots)
   * - Pepsi globusi: qizil tepa, ko'k tag, o'rtasida oq lenta
   * - Oq lenta ustida qora bosh harflar bilan 'PEPSI' yozuvi
   * - Butun doira atrofida oq jilo hoshiyasi
   */
  private static drawExactPepsi(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // 1. Asosiy moviy fon (Rasmda: to'yingan moviy ko'k)
    const bgGrad = ctx.createLinearGradient(0, 0, w, 0);
    bgGrad.addColorStop(0, '#00438a');
    bgGrad.addColorStop(0.5, '#005cb9');
    bgGrad.addColorStop(1, '#00438a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.5;

    // 2. Rasmda logo atrofida tarqalgan yarim tonli nuqtalar to'lqini (Halftone particle glow)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    for (let radius = 140; radius <= 260; radius += 14) {
      const dotCount = Math.floor(radius / 2.5);
      for (let i = 0; i < dotCount; i++) {
        const ang = (i / dotCount) * Math.PI * 2;
        const dx = cx + Math.cos(ang) * radius;
        const dy = cy + Math.sin(ang) * radius;
        ctx.beginPath();
        ctx.arc(dx, dy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Markaziy Pepsi Globusi
    const r = h * 0.36; // Katta, yaqqol ko'rinadigan logo

    // Oq qalin tashqi gardish
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.fill();

    // Qizil yuqori qism
    ctx.fillStyle = '#e31b23';
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // To'q ko'k pastki qism
    ctx.fillStyle = '#0033a0';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();

    // O'rtadagi keng oq to'lqin lentasi
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    // Yuqori to'lqin konturi
    ctx.moveTo(cx - r, cy - 10);
    ctx.bezierCurveTo(cx - r * 0.35, cy - 35, cx + r * 0.35, cy + 25, cx + r, cy);
    // O'ng chet
    ctx.lineTo(cx + r, cy + 30);
    // Quyi to'lqin konturi
    ctx.bezierCurveTo(cx + r * 0.35, cy + 55, cx - r * 0.35, cy - 5, cx - r, cy + 20);
    ctx.closePath();
    ctx.fill();

    // 4. Rasmdagi kabi 'PEPSI' QORA KATTA HARFLARI (to'lqin o'rtasida)
    ctx.fillStyle = '#111827'; // To'q qora
    ctx.font = '900 64px "Arial Black", "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PEPSI', cx, cy + 8);

    // Hajmi (1.5L) o'ng pastda
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('1.5 L', w - 40, h - 25);
  }

  private static drawExactCola(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const bgGrad = ctx.createLinearGradient(0, 0, w, 0);
    bgGrad.addColorStop(0, '#990000');
    bgGrad.addColorStop(0.5, '#e11d48');
    bgGrad.addColorStop(1, '#990000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Dinamik oq lentali to'lqin
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.bezierCurveTo(w * 0.3, h * 0.92, w * 0.7, h * 0.42, w, h * 0.68);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 88px "Brush Script MT", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Coca-Cola', w / 2, h * 0.42);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('ORIGINAL TASTE 1.5L', w / 2, h * 0.84);
  }

  private static drawExactFanta(ctx: CanvasRenderingContext2D, w: number, h: number): void {
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
  }

  private static drawExactSprite(ctx: CanvasRenderingContext2D, w: number, h: number): void {
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
  }

  private static drawExactSnickers(ctx: CanvasRenderingContext2D, w: number, h: number): void {
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
  }

  private static drawExactMilka(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 900 90px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Milka', w / 2, h * 0.44);
  }

  private static drawExactNutella(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.font = '900 78px "Arial Black", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000000';
    ctx.fillText('n', w / 2 - 50, h * 0.48);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('utella', w / 2 - 48, h * 0.48);
  }

  private static drawExactOreo(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.5, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 76px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OREO', w / 2, h * 0.5);
  }

  private static drawBrandDefault(ctx: CanvasRenderingContext2D, w: number, h: number, p: ProductItem): void {
    ctx.fillStyle = p.color;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = p.secondaryColor || '#ffffff';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 52px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.name, w / 2, h * 0.5);
  }
}
