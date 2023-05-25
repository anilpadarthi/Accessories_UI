import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Category } from "src/app/shared/models/category";
import { Response } from "src/app/shared/models/response";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LookupService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `${environment.apiUrl}/api/Lookup/`
  }

  //TODO:Keep the prefix url in environment file.
  //public url = environment.url + "https://localhost:44352/api/Lookup/";

  getCategories(): Observable<any> {
    return this.http.get<any>(this.url + "Categories");
  }

  getSubCategories(categoryId: number): Observable<any> {
    return this.http.get<any>(this.url + categoryId + "/SubCategories");
  }

  getColours(): Observable<any> {
    return this.http.get<any>(this.url + "Colours");
  }

  getSizes(): Observable<any> {
    return this.http.get<any>(this.url + "Sizes");
  }

  getConfigurationTypes(): Observable<any> {
    return this.http.get<any>(this.url + "ConfigurationTypes");
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.url + "Products");
  }

  getSuppliers(): Observable<any> {
    return this.http.get<any>(this.url + "Suppliers");
  }

  getOrderStatusTypes(): Observable<any> {
    return this.http.get<any>(this.url + "OrderStatusTypes");
  }

  getOrderPaymentTypes(): Observable<any> {
    return this.http.get<any>(this.url + "OrderPaymentTypes");
  }

  getOrderDeliveryTypes(): Observable<any> {
    return this.http.get<any>(this.url + "OrderDeliveryTypes");
  }

  getAgents(): Observable<any> {
    return this.http.get<any>(this.url + "Agents");
  }

  getManagers(): Observable<any> {
    return this.http.get<any>(this.url + "Managers");
  }

  getAreas(): Observable<any> {
    return this.http.get<any>(this.url + "Areas");
  }

  getShops(areaId: number): Observable<any> {
    return this.http.get<any>(this.url + "Shops/" + areaId);
  }
}
