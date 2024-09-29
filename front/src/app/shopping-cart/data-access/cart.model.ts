export interface CartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
  }
  
export interface Cart {
    items: CartItem[];
    totalPrice: number;
  }