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

  url: string;

  constructor(public http: HttpClient) { 
    this.url = `${environment.apiUrl}/api/Order`;
  }

  
  getPagedOrderList(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.url}/GetPagedOrderList`, requestBody);
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

  getOrderHistory(orderId: number): Observable<any> {
    return this.http.get<any>(this.url + "/GetOrderHistory/" + orderId);
  }

  downloadOrders(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + "/DownloadOrders", requestBody);
  }

  downloadOrdersPDF(invoiceNo: any): Observable<any> {
    return this.http.get<any>(this.url + "/GeneratePdfInvoice?orderId=" + invoiceNo);
  }

  getOrderNotificationCount(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetOrderNotificationCount`);
  }

}
