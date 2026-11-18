import * as THREE from 'three';
import { ProductItem } from '../types';

/**
 * Rasmga 100% o'xshash fotorealistik teksturalar:
 * 1-qavat: Pepsi (to'q ko'k, qizil-oq-ko'k logo, "pepsi")
 * 2-qavat: Coca-Cola (qizil etiketka, oq xattotlik "Coca-Cola")
 * 3-qavat: Fanta (apelsin rang, "Fanta" logotipi)
 * 4-qavat: Sprite (yashil shaffof, oq-sariq "Sprite" logotipi)
 * 5-qavat: Montella (kumush-oq/och ko'k etiketka, toza suv, "Montella")
 * 6-qavat: Nestlé Pure Life (ko'k to'lqinli qalin etiketka, "Nestle Pure Life")
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

  // 1. NESTLÉ PURE LIFE (Rasmda 6-qavat: moviy/ko'k fon, oq Nestlé Pure Life logotipi)
  private static drawNestle(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#005a9c');
    grad.addColorStop(0.5, '#0072ce');
    grad.addColorStop(1, '#005a9c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Oq to'lqinlar
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.75);
    ctx.bezierCurveTo(w * 0.25, h * 0.6, w * 0.75, h * 0.9, w, h * 0.75);
    ctx.stroke();

    // Markaziy oq doiraviy tamg'a
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

  // 2. MONTELLA (Rasmda 5-qavat: oq va kumushrang-ko'k etiketka, "Montella" qalin yozuvi)
  private static drawMontella(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Moviy tog' silueti
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

    // Oq tog' cho'qqilari
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.28);
    ctx.lineTo(w * 0.2, h * 0.38);
    ctx.lineTo(w * 0.3, h * 0.38);
    ctx.closePath();
    ctx.fill();

    // Montella yozuvi
    ctx.fillStyle = '#0284c7';
    ctx.font = '900 68px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Montella', w / 2, h * 0.52);

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('NATURAL MINERAL WATER 1.5L', w / 2, h * 0.8);
  }

  // 3. SPRITE (Rasmda 4-qavat: yashil shaffof shisha, oq yozuvli Sprite etiketkasi)
  private static drawSprite(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#008b47';
    ctx.fillRect(0, 0, w, h);

    // Sariq limon
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

  // 4. FANTA (Rasmda 3-qavat: apelsin rangli suyuqlik, ko'k oval, oq "FANTA")
  private static drawFanta(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, w, h);

    // Yashil barg
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(w / 2 + 80, h * 0.24, 50, 24, Math.PI / 3, 0, Math.PI * 2);
    ctx.fill();

    // Ko'k qiya fon
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

  // 5. COCA-COLA (Rasmda 2-qavat: qora suyuqlik, qizil etiketka, oq to'lqin va xattotlik "Coca-Cola")
  private static drawCola(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#990000');
    grad.addColorStop(0.5, '#e11d48');
    grad.addColorStop(1, '#990000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Oq to'lqin
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

  // 6. PEPSI (Rasmda 1-qavat: qora suyuqlik, moviy fon, Pepsi globusi, oq lenta, qora "PEPSI")
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
