import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'app/products/data-access/product.model';
import { CartItem, Cart } from 'app/shopping-cart/data-access/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private cartItemsSubject = new BehaviorSubject<number>(0);
  cartItems$ = this.cartItemsSubject.asObservable();
  
  cart = signal<Cart>({
    items: [],
    totalPrice: 0,
  });

  constructor() {
    this.loadCartFromLocalStorage();
  }

  private calculateTotalPrice(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private saveCartToLocalStorage(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private loadCartFromLocalStorage(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const cart = JSON.parse(cartData);
      this.cart.set(cart);
    }
  }

  addItem(product: Product) {
    this.cart.update((currentCart) => {
      const existingItem = currentCart.items.find((i) => i.productId === product.id);

      if (existingItem) {
        // Increment quantity if item already exists
        existingItem.quantity += existingItem.quantity;
      } else {
        const newCartItem: CartItem = {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price, // Assuming price is part of Product
        };
        // Add the new item if it doesn't exist
        currentCart.items.push(newCartItem);
      }

      currentCart.totalPrice = this.calculateTotalPrice(currentCart.items);
      // Save cart to local storage
      this.saveCartToLocalStorage(currentCart);
      this.cartItemsSubject.next(currentCart.items.length); // Notify subscribers
      console.log('Item added. New count:', currentCart.items.length);

      return currentCart;
    });
  }

  removeItem(productId: number) {
    this.cart.update((currentCart) => {
      const item = currentCart.items.find((i) => i.productId === productId);

      if (item) {
        currentCart.totalPrice -= item.price * item.quantity;
        currentCart.items = currentCart.items.filter((i) => i.productId !== productId);
      }

        // Notify the total quantity after removal
        this.cartItemsSubject.next(this.getTotalQuantity()); // Update quantity
        this.saveCartToLocalStorage(currentCart);

        return currentCart;
    });
  }

  clearCart() {
    this.cart.set({
      items: [],
      totalPrice: 0,
    });
    this.saveCartToLocalStorage(this.cart());
  }

  getTotalQuantity(): number {
    return this.cart().items.reduce((total, item) => total + item.quantity, 0);
}
}
