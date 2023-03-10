import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Category } from "src/app/shared/models/category";
import { Response } from "src/app/shared/models/response";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { OrderDetails } from "../models/orderDetails";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(public http: HttpClient) {}

  //TODO:Keep the prefix url in environment file.
  public url = environment.url + "https://localhost:7159/api/Order";

  getAll(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + "/GetByPaging", requestBody);
  }

  getById(id: number): Observable<Response> {
    return this.http.get<Response>(this.url + "/GetById/" + id);
  }

  create(orderDetails: OrderDetails): Observable<Response> {
    return this.http.post<Response>(this.url + "/Create", orderDetails);
  }

  update(orderDetails: OrderDetails): Observable<Response> {
    return this.http.put<Response>(this.url + "/Update", orderDetails);
  }

  updateStatus(orderDetails: OrderDetails): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus", orderDetails);
  }

  delete(category: Category): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus", category);
  }
}
