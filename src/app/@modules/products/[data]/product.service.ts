import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product.interface';
import { finalize, Observable } from 'rxjs';
import { LoadingAPIService } from '@core/loading-api/loading-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'http://localhost:3000/products';
  constructor(private http: HttpClient, private loadingAPIService: LoadingAPIService) {}

  getProducts(): Observable<Product.Entity[]> {
    this.loadingAPIService.show();
    return this.http.get<Product.Entity[]> (this.productsUrl)
    .pipe(
      finalize(() => {
        this.loadingAPIService.hide();
      })
    );
  }

  createProduct(val: Product.Entity) {
    this.loadingAPIService.show();
    return this.http.post(this.productsUrl, val)
    .pipe(
      finalize(() => {
        this.loadingAPIService.hide();
      })
    );
  }

  updateProduct(val: Product.Entity) {
    console.log("val", val);
    this.loadingAPIService.show();
    return this.http.put(this.productsUrl + "/" + val.id, val)
    .pipe(
      finalize(() => {
        this.loadingAPIService.hide();
      })
    );
  }

  deleteProduct(productId: number) {
    this.loadingAPIService.show();
    return this.http.delete(this.productsUrl + "/" + productId)
    .pipe(
      finalize(() => {
        this.loadingAPIService.hide();
      })
    );
  }

  getProduct(productid: number) {
    this.loadingAPIService.show();
    return this.http.get < Product.Entity > (this.productsUrl + "/" + productid)
      .pipe(
        finalize(() => {
          this.loadingAPIService.hide();
        })
      );
  }
}
