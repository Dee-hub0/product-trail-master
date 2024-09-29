import { Component, OnInit } from '@angular/core';
import { CartService } from 'app/shopping-cart/data-access/cart.service';
import { CartItem } from "app/shopping-cart/data-access/cart.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.items = this.cartService.cart().items;
    this.total = this.cartService.cart().totalPrice;
  }

  removeItem(productId :number) {
    this.cartService.removeItem(productId);
    this.loadCart(); // Remives an item from the cart
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCart(); // Reload cart items after clearing
  }
}
