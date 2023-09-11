import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "src/app/shared/models/product";
import { Response } from "src/app/shared/models/response";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  url: string;

  public allProductsSubject = new BehaviorSubject<any>('');
  public allProductsSubject$ = this.allProductsSubject.asObservable();

  constructor(public http: HttpClient) {
    this.url = `${environment.apiUrl}/api/Product`
  }

  getProductList(): Observable<any> {
    return this.http.get<any>(this.url + "/GetAll");
  }

  getAll(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + "/GetByPaging", requestBody);
  }

  getProduct(id: number): Observable<Response> {
    return this.http.get<Response>(this.url + "/" + id);
  }

  addProduct(requestBody: any): Observable<Response> {
    return this.http.post<Response>(this.url, requestBody);
  }

  addProductImage(requestBody: any): Observable<Response> {
    return this.http.post<Response>(this.url+"/AddProductImage", requestBody);
  }

  updateProduct(requestBody: any): Observable<Response> {
    return this.http.put<Response>(this.url, requestBody);
  }

  deleteProduct(requestBody: any): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus", requestBody);
  }

  addBulkProduct(requestBody: any): Observable<Response> {
    return this.http.post<Response>(this.url+"/CreateBundleProduct", requestBody);
  }

  getAllProducts(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + "/GetAllProducts", requestBody);
  }

}
