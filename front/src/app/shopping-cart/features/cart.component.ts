import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from 'app/shopping-cart/data-access/cart.service';
import { CartItem } from 'app/shopping-cart/data-access/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class CartComponent implements OnInit {
  items: CartItem[] = []; // Array to hold cart items
  total: number = 0; // Total price of cart items

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(() => {
      this.loadCart(); // Reload cart items and total when items change
    });
  }

  // Load cart items and total price from the cart service
  private loadCart(): void {
    const cart = this.cartService.cart(); // Get cart from the service
    this.items = cart.items; // Set cart items
    this.total = cart.totalPrice; // Set total price
  }

  // Remove an item from the cart and refresh the cart display
  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
    this.loadCart(); // Refresh cart items after removal
  }

  // Clear the entire cart and refresh the cart display
  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart(); // Refresh cart items after clearing
  }

  updateCartItemQuantity(item: CartItem) {
    if (item.quantity < 1) {
        this.removeItem(item.productId);
    } else {
        this.cartService.updateQuantity(item.productId, item.quantity);
    }
}
}