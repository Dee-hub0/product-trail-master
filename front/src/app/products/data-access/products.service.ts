import { Injectable, inject, signal } from "@angular/core";
import { environment } from 'app/../environments/environment';
import { Product } from "./product.model";
import { HttpClient, HttpHeaders  } from "@angular/common/http";
import { catchError, Observable, of, tap, map } from "rxjs";

@Injectable({
    providedIn: "root"
}) export class ProductsService {

    private readonly http = inject(HttpClient);
    private baseUrl = environment.API_URL;
    private readonly path = `${this.baseUrl}/api/products`;
    
    private readonly _products = signal<Product[]>([]);

    public readonly products = this._products.asReadonly();

    public get(): Observable<Product[]> {
        return this.http.get<any>(this.path).pipe(
            catchError((error) => {
                return this.http.get<Product[]>("assets/products.json");
            }),
            map(response => response.member), // Access the 'member' array
            tap(products => this._products.set(products)),
        );
    }

    public create(product: Product): Observable<boolean> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/ld+json' // Set Content-Type header
        });
        return this.http.post<boolean>(this.path, product, { headers }).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product): Observable<boolean> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/merge-patch+json' // Set Content-Type header
        });
        return this.http.patch<boolean>(`${this.path}/${product.id}`, product, { headers }).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }

    public getPaginatedProducts(page: number, pageSize: number, searchTerm: string = ''): Product[] {
        const filteredProducts = this._products().filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const startIndex = (page - 1) * pageSize;
        return filteredProducts.slice(startIndex, startIndex + pageSize);
    }

    public getTotalProductsCount(searchTerm: string = ''): number {
        return this._products().filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length;
    }
}