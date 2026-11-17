import { ProductItem, CartItem } from '../types';

/**
 * Supermarket xarid savati logikasi (LocalStorage integratsiyasi bilan)
 */
export class CartManager {
  private items: CartItem[] = [];
  private storageKey = 'mini_market_cart_v1';
  private listeners: Array<(items: CartItem[]) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Savatga mahsulot qo'shish
   */
  public addItem(product: ProductItem): void {
    const existing = this.items.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.saveAndNotify();
  }

  /**
   * Mahsulot miqdorini 1 taga kamaytirish
   */
  public decreaseItem(productId: string): void {
    const index = this.items.findIndex((item) => item.product.id === productId);
    if (index !== -1) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity -= 1;
      } else {
        this.items.splice(index, 1);
      }
      this.saveAndNotify();
    }
  }

  /**
   * Mahsulotni savatdan butunlay o'chirish
   */
  public removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.saveAndNotify();
  }

  /**
   * Savatni tozalash
   */
  public clearCart(): void {
    this.items = [];
    this.saveAndNotify();
  }

  /**
   * Jami narxni hisoblash
   */
  public getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  /**
   * Savatdagi jami mahsulotlar soni
   */
  public getTotalCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Hozirgi mahsulotlar ro'yxati
   */
  public getItems(): CartItem[] {
    return [...this.items];
  }

  /**
   * Savat o'zgarishini tinglovchi qo'shish
   */
  public subscribe(callback: (items: CartItem[]) => void): void {
    this.listeners.push(callback);
    callback(this.getItems());
  }

  private saveAndNotify(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (err) {
      console.warn("LocalStorage ga yozishda xatolik:", err);
    }
    this.listeners.forEach((cb) => cb(this.getItems()));
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.items = JSON.parse(data);
      }
    } catch (err) {
      console.warn("LocalStorage dan o'qishda xatolik:", err);
      this.items = [];
    }
  }
}
