import { Component, OnInit, inject, signal, Output, EventEmitter } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { NgOptimizedImage } from '@angular/common';
import { CartService } from 'app/shopping-cart/data-access/cart.service';

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, CommonModule, ButtonModule, DialogModule, ProductFormComponent, NgOptimizedImage, FormsModule],
})
export class ProductListComponent implements OnInit {

  @Output() itemAdded = new EventEmitter<void>();

  constructor(private cartService: CartService) {}
  
  private readonly productsService = inject(ProductsService);
  
  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);
  public imagesPath: string = 'assets/images/';
  defaultImageName: string = 'product-default.png';
  
  // Pagination and filtering
  public page: number = 1; // Current page
  public pageSize: number = 8; // Number of products per page
  public paginatedProducts: Product[] = [];
  public totalProductsCount: number = 0;

  ngOnInit() {
    this.productsService.get().subscribe(() => {
      this.updatePaginatedProducts();
    });
  }

  public handleImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imagesPath + this.defaultImageName;
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
  
  public addToCart(product: Product, quantity: string) {
    const newQuantity = Math.max(1, Number(quantity)); // Ensure quantity is at least 1 and a number
    this.cartService.addItem(product, newQuantity).subscribe({
      next: (message) => {
          console.log(message);
      },
      error: (error) => {
          console.error(error);
      }
  });
  
    this.itemAdded.emit();
  }

  // Method to update paginated products  
  private updatePaginatedProducts() {
    const filteredProducts = this.products();
    this.totalProductsCount = filteredProducts.length || 0;
    const startIndex = (this.page - 1) * this.pageSize;
    const memberProductList = 
    this.paginatedProducts = filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  // Method to change pages
  public changePage(newPage: number) {
    if (newPage < 1 || newPage > this.getTotalPages()) {
      return;
    }
    this.page = newPage;
    this.updatePaginatedProducts();
  }

  public getTotalPages(): number {
    return Math.ceil(this.totalProductsCount / this.pageSize);
  }


}
