import {
  Component,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from 'app/shopping-cart/data-access/cart.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, CommonModule],
})
export class AppComponent {
  title = "ALTEN SHOP";
  cartItemsCount: number = 0;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(() => {
    this.cartItemsCount = this.cartService.getTotalQuantity();
  });
  this.cartService.successMessage$.subscribe(message => {
    this.successMessage = message;
    // Optionally, you can clear the message after a delay
    setTimeout(() => this.successMessage = '', 3000);
  });

  this.cartService.errorMessage$.subscribe(message => {
    this.errorMessage = message;
    // Optionally, you can clear the message after a delay
    setTimeout(() => this.errorMessage = '', 3000);
  });
  }

  clearCart() {
      this.cartService.clearCart();
      this.cartItemsCount = 0; // Reset item count when cart is cleared
  }
}
