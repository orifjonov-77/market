export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  color: string;
  secondaryColor?: string;
  shape: 'bottle' | 'can' | 'box' | 'cylinder' | 'bread_round' | 'pouch' | 'fruit' | 'frozen_pack';
  size: {
    w: number;
    h: number;
    d: number;
  };
  korzinkaPlacement: 'ambient_shelf' | 'chilled_fridge' | 'frozen_freezer' | 'produce_crate' | 'bakery_rack';
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
