import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'app/products/data-access/product.model';
import { CartItem, Cart } from 'app/shopping-cart/data-access/cart.model';
import { catchError, Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Observable for the number of items in the cart
  private cartItemsSubject = new BehaviorSubject<number>(0);
  private successMessageSubject = new BehaviorSubject<string>('');
  private errorMessageSubject = new BehaviorSubject<string>('');

  successMessage$ = this.successMessageSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();

  cartItems$ = this.cartItemsSubject.asObservable();
  successMessage: string = '';
  errorMessage: string = '';
  // Cart state using Angular signals
  cart = signal<Cart>({
    items: [],
    totalPrice: 0,
  });

  constructor() {
    this.loadCartFromLocalStorage();
  }

  // Calculate the total price of items in the cart
  private calculateTotalPrice(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Save the cart state to local storage
  private saveCartToLocalStorage(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Load the cart state from local storage
  private loadCartFromLocalStorage(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const loadedCart = JSON.parse(cartData);
      this.cart.set(loadedCart);
      this.cartItemsSubject.next(this.getTotalQuantity()); // Update item count after loading
    }
  }

  // Add an item to the cart
  addItem(product: Product, quantity :number): Observable<string> {
    return new Observable<string>((observer) => {
        this.cart.update((currentCart) => {
            const existingItem = currentCart.items.find((i) => i.productId === product.id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                const newCartItem: CartItem = {
                    productId: product.id,
                    productName: product.name,
                    quantity: quantity,
                    price: product.price,
                };
                currentCart.items.push(newCartItem);
            }

            currentCart.totalPrice = this.calculateTotalPrice(currentCart.items);
            this.saveCartToLocalStorage(currentCart);
            this.cartItemsSubject.next(currentCart.items.length);
            this.successMessageSubject.next(`${product.name} a été ajouté au panier avec succès!`);
            observer.next(`${product.name} a été ajouté au panier avec succès!`);
            observer.complete();

            return currentCart;
        });
    }).pipe(
        catchError(() => {
            // Handle error and emit a default error message
            this.errorMessageSubject.next("Une erreur s'est produite lors de l'ajout au panier.");
            return of("Une erreur s'est produite lors de l'ajout au panier.");
        })
    );
}



  // Remove an item from the cart
  removeItem(productId: number): void {
    this.cart.update((currentCart) => {
      const itemIndex = currentCart.items.findIndex((i) => i.productId === productId);

      if (itemIndex !== -1) {
        const item = currentCart.items[itemIndex];
        currentCart.totalPrice -= item.price * item.quantity; // Deduct price
        currentCart.items.splice(itemIndex, 1); // Remove the item
      }

      // Update item count and save to local storage
      this.cartItemsSubject.next(this.getTotalQuantity());
      this.saveCartToLocalStorage(currentCart);

      return currentCart; // Return the updated cart
    });
  }

  // Clear the entire cart
  clearCart(): void {
    this.cart.set({ items: [], totalPrice: 0 }); // Reset cart
    this.saveCartToLocalStorage(this.cart()); // Save empty cart
  }

  // Get the total quantity of items in the cart
  getTotalQuantity(): number {
    return this.cart().items.reduce((total, item) => total + item.quantity, 0);
  }


  updateQuantity(productId: number, quantity: number) {
    this.cart.update((currentCart) => {
        const item = currentCart.items.find(i => i.productId === productId);
        if (item) {
            // Update the item's quantity
            item.quantity = quantity;

            // Recalculate the total price based on updated quantities
            currentCart.totalPrice = this.calculateTotalPrice(currentCart.items);
            
            // Save the updated cart to local storage
            this.saveCartToLocalStorage(currentCart);
            
            // Notify subscribers about the total item count
            this.cartItemsSubject.next(currentCart.items.length);

        }
        return currentCart; // Return the updated cart
    });
}



}
