import {
  Component,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from 'app/shopping-cart/data-access/cart.service';
import { CartItem } from "app/shopping-cart/data-access/cart.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent],
})
export class AppComponent {
  title = "ALTEN SHOP";
  cartItemsCount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(() => {
      this.cartItemsCount = this.cartService.getTotalQuantity();
  });
  }

  clearCart() {
      this.cartService.clearCart();
      this.cartItemsCount = 0; // Reset item count when cart is cleared
  }
}
