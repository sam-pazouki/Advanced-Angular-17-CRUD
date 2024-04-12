import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductModel } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private productsUrl = 'api/products1/';
  constructor(private http: HttpClient) { }

  getallproducts() {
    return this.http.get<ProductModel[]>(this.productsUrl);
  }

  Createproduct(inputdata: ProductModel) {
    return this.http.post(this.productsUrl, inputdata);
  }

  Updateproduct(inputdata: ProductModel) {
    return this.http.put(this.productsUrl+inputdata.id, inputdata);
  }
  Deleteproduct(productid: number) {
    return this.http.delete(this.productsUrl+productid);
  }
  Getproduct(productid: number) {
    return this.http.get<ProductModel>(this.productsUrl+productid);
  }


}
