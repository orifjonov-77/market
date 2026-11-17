import { CartManager } from './cart';
import { CartItem } from '../types';

/**
 * Supermarket xarid savati foydalanuvchi interfeysi (UI) boshqaruvi
 */
export class CartUi {
  private cart: CartManager;
  private cartPanel: HTMLElement | null;
  private cartItemsContainer: HTMLElement | null;
  private cartTotalPriceEl: HTMLElement | null;
  private cartCountBadge: HTMLElement | null;
  private cartEmptyMsg: HTMLElement | null;
  private toastContainer: HTMLElement | null;

  constructor(cart: CartManager) {
    this.cart = cart;
    this.cartPanel = document.getElementById('cart-panel');
    this.cartItemsContainer = document.getElementById('cart-items');
    this.cartTotalPriceEl = document.getElementById('cart-total-price');
    this.cartCountBadge = document.getElementById('cart-count-badge');
    this.cartEmptyMsg = document.getElementById('cart-empty-message');
    this.toastContainer = document.getElementById('toast-container');

    this.initEvents();
    this.cart.subscribe((items) => this.render(items));
  }

  private initEvents(): void {
    // Savat panelini yig'ish / yoyish
    const toggleBtn = document.getElementById('cart-toggle-btn');
    const minimizeBtn = document.getElementById('cart-minimize-btn');

    const toggleMinimize = (e: Event) => {
      e.stopPropagation();
      if (this.cartPanel) {
        this.cartPanel.classList.toggle('minimized');
        if (minimizeBtn) {
          minimizeBtn.textContent = this.cartPanel.classList.contains('minimized') ? '▴' : '▾';
        }
      }
    };

    toggleBtn?.addEventListener('click', toggleMinimize);

    // Savatni tozalash tugmasi
    const clearBtn = document.getElementById('cart-clear-btn');
    clearBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.cart.getItems().length > 0) {
        this.cart.clearCart();
        this.showToast("Savat tozalandi");
      }
    });

    // Buyurtma berish tugmasi
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    checkoutBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const count = this.cart.getTotalCount();
      const total = this.cart.getTotalPrice();
      if (count === 0) {
        this.showToast("⚠️ Savatingiz bo'sh!");
        return;
      }
      alert(`🎉 Xaridingiz qabul qilindi!\n\nJami tovarlar: ${count} ta\nUmumiy summa: ${total.toLocaleString('uz-UZ')} so'm\n\nXaridingiz uchun rahmat!`);
      this.cart.clearCart();
    });
  }

  /**
   * Savat ro'yxatini qayta chizish
   */
  public render(items: CartItem[]): void {
    if (!this.cartItemsContainer || !this.cartTotalPriceEl || !this.cartCountBadge || !this.cartEmptyMsg) {
      return;
    }

    const totalCount = this.cart.getTotalCount();
    const totalPrice = this.cart.getTotalPrice();

    this.cartCountBadge.textContent = totalCount.toString();
    this.cartTotalPriceEl.textContent = `${totalPrice.toLocaleString('uz-UZ')} so'm`;

    if (items.length === 0) {
      this.cartEmptyMsg.style.display = 'block';
      this.cartItemsContainer.innerHTML = '';
      return;
    }

    this.cartEmptyMsg.style.display = 'none';
    this.cartItemsContainer.innerHTML = '';

    items.forEach((item) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-details">
          <span class="cart-item-name" title="${item.product.name}">${item.product.name}</span>
          <span class="cart-item-price">${(item.product.price * item.quantity).toLocaleString('uz-UZ')} so'm</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-id="${item.product.id}">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.product.id}">+</button>
          <button class="remove-btn" data-action="del" data-id="${item.product.id}" title="O'chirish">✕</button>
        </div>
      `;

      // Tugmalarga hodisalarni bog'lash
      itemEl.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const action = target.getAttribute('data-action');
        const id = target.getAttribute('data-id');

        if (!action || !id) return;
        e.stopPropagation();

        if (action === 'inc') {
          this.cart.addItem(item.product);
        } else if (action === 'dec') {
          this.cart.decreaseItem(id);
        } else if (action === 'del') {
          this.cart.removeItem(id);
          this.showToast(`"${item.product.name}" savatdan o'chirildi`);
        }
      });

      this.cartItemsContainer?.appendChild(itemEl);
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

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }
}
