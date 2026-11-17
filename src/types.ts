export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  color: string;
  secondaryColor?: string;
  accentColor?: string;
  shape: 'box' | 'cylinder' | 'bottle' | 'can' | 'bread_round';
  size: {
    w: number;
    h: number;
    d: number;
  };
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
