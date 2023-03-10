import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "src/app/shared/models/product";
import { Response } from "src/app/shared/models/response";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(public http: HttpClient) {}

  //TODO:Keep the prefix url in environment file.
  public url = environment.url + "https://localhost:7159/api/Product";

  getProductList(): Observable<any> {
    return this.http.get<any>(this.url + "/GetAll");
  }

  getAll(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + "/GetByPaging", requestBody);
  }

  getProduct(id: number): Observable<Response> {
    return this.http.get<Response>(this.url + "/" + id);
  }

  addProduct(product: Product): Observable<Response> {
    return this.http.post<Response>(this.url, product);
  }

  updateProduct(product: Product): Observable<Response> {
    return this.http.put<Response>(this.url, product);
  }

  deleteProduct(product: Product): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus", product);
  }
}
