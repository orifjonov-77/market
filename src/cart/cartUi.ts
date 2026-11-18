import { CartManager } from './cart';
import { CartItem } from '../types';

/**
 * Supermarket xarid savati UI boshqaruvi:
 * - Telefonda ekranni to'ldirib qo'ymaydi: har doim qulay kichik Floating Tugma turadi.
 * - Tugma bosilganda zamonaviy to'liq savat modali/paneli ochiladi.
 * - Har bir mahsulotning rasmiy brend ikonkalari, nomi, donasi va narxi 100% aniq ko'rsatiladi.
 */
export class CartUi {
  private cart: CartManager;

  // Elementlar
  private floatingBtn: HTMLElement | null;
  private floatingCount: HTMLElement | null;
  private floatingTotal: HTMLElement | null;

  private backdrop: HTMLElement | null;
  private modal: HTMLElement | null;
  private closeBtn: HTMLElement | null;

  private countBadge: HTMLElement | null;
  private totalPriceEl: HTMLElement | null;
  private itemsContainer: HTMLElement | null;
  private emptyMsg: HTMLElement | null;
  private toastContainer: HTMLElement | null;

  constructor(cart: CartManager) {
    this.cart = cart;

    this.floatingBtn = document.getElementById('cart-floating-btn');
    this.floatingCount = document.getElementById('floating-cart-count');
    this.floatingTotal = document.getElementById('floating-cart-total');

    this.backdrop = document.getElementById('cart-backdrop');
    this.modal = document.getElementById('cart-modal');
    this.closeBtn = document.getElementById('cart-close-btn');

    this.countBadge = document.getElementById('cart-count-badge');
    this.totalPriceEl = document.getElementById('cart-total-price');
    this.itemsContainer = document.getElementById('cart-items');
    this.emptyMsg = document.getElementById('cart-empty-message');
    this.toastContainer = document.getElementById('toast-container');

    this.initEvents();
    this.cart.subscribe((items) => this.render(items));
  }

  private initEvents(): void {
    // 1. Savat tugmasini bosganda modalni ochish
    this.floatingBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openCart();
    });

    // 2. Savatni yopish (X tugmasi yoki fonni bosganda)
    this.closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeCart();
    });

    this.backdrop?.addEventListener('click', () => {
      this.closeCart();
    });

    // 3. Tozalash tugmasi
    const clearBtn = document.getElementById('cart-clear-btn');
    clearBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.cart.getItems().length > 0) {
        this.cart.clearCart();
        this.showToast("🧹 Savat tozalandi");
      }
    });

    // 4. Xaridni yakunlash (Buyurtma berish)
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    checkoutBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const count = this.cart.getTotalCount();
      const total = this.cart.getTotalPrice();

      if (count === 0) {
        this.showToast("⚠️ Savatingizda hali mahsulot yo'q!");
        return;
      }

      alert(
        `🎉 TABRIKLAYMIZ! XARIDINGIZ QABUL QILINDI!\n\n` +
        `📦 Jami tovarlar: ${count} ta\n` +
        `💰 Umumiy to'lov: ${total.toLocaleString('uz-UZ')} so'm\n\n` +
        `Mini Market - 3D Supermarket xizmatidan foydalanganingiz uchun rahmat!`
      );
      this.cart.clearCart();
      this.closeCart();
    });
  }

  public openCart(): void {
    this.modal?.classList.remove('hidden');
    this.backdrop?.classList.remove('hidden');
  }

  public closeCart(): void {
    this.modal?.classList.add('hidden');
    this.backdrop?.classList.add('hidden');
  }

  /**
   * Savat va floating tugmani ma'lumotlar bilan yangilash
   */
  public render(items: CartItem[]): void {
    const totalCount = this.cart.getTotalCount();
    const totalPrice = this.cart.getTotalPrice();
    const formattedPrice = `${totalPrice.toLocaleString('uz-UZ')} so'm`;

    // 1. Floating kichik tugmani yangilash
    if (this.floatingCount) {
      this.floatingCount.textContent = totalCount.toString();
    }
    if (this.floatingTotal) {
      this.floatingTotal.textContent = formattedPrice;
    }

    // 2. Modal ichidagi jami son va summani yangilash
    if (this.countBadge) {
      this.countBadge.textContent = `${totalCount} ta`;
    }
    if (this.totalPriceEl) {
      this.totalPriceEl.textContent = formattedPrice;
    }

    // 3. Ro'yxatni chizish
    if (!this.itemsContainer || !this.emptyMsg) return;

    if (items.length === 0) {
      this.emptyMsg.style.display = 'flex';
      this.itemsContainer.innerHTML = '';
      return;
    }

    this.emptyMsg.style.display = 'none';
    this.itemsContainer.innerHTML = '';

    items.forEach((item) => {
      const prod = item.product;
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item-card';

      // Kategoriya va brendga mos emojilar
      let icon = '📦';
      if (prod.category === 'ichimliklar') icon = '🥤';
      if (prod.category === 'shirinliklar') icon = '🍫';
      if (prod.category === 'konserva') icon = '🥫';
      if (prod.category === 'baqqollik') icon = '🌾';

      itemEl.innerHTML = `
        <div class="cart-item-thumbnail" style="background-color: ${prod.color}22; border-color: ${prod.color}">
          <span class="thumb-icon">${icon}</span>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name" title="${prod.name}">${prod.name}</div>
          <div class="cart-item-category">${prod.category.toUpperCase()}</div>
          <div class="cart-item-price-each">${(prod.price * item.quantity).toLocaleString('uz-UZ')} so'm</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-id="${prod.id}">−</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" data-action="inc" data-id="${prod.id}">+</button>
          <button class="del-btn" data-action="del" data-id="${prod.id}" title="O'chirish">🗑️</button>
        </div>
      `;

      itemEl.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const action = target.getAttribute('data-action');
        const id = target.getAttribute('data-id');
        if (!action || !id) return;
        e.stopPropagation();

        if (action === 'inc') {
          this.cart.addItem(prod);
        } else if (action === 'dec') {
          this.cart.decreaseItem(id);
        } else if (action === 'del') {
          this.cart.removeItem(id);
          this.showToast(`"${prod.name}" savatdan olib tashlandi`);
        }
      });

      this.itemsContainer?.appendChild(itemEl);
    });
  }

  /**
   * Bildirishnoma (Toast) chiqarish
   */
  public showToast(message: string): void {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    // Kichik tebranish animatsiyasi (floating tugmaga)
    this.floatingBtn?.classList.add('pulse');
    setTimeout(() => this.floatingBtn?.classList.remove('pulse'), 400);

    setTimeout(() => {
      toast.remove();
    }, 2400);
  }
}
