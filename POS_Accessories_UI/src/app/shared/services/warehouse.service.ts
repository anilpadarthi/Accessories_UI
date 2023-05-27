import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { WareHouse } from '../models/warehouse';

@Injectable({
  providedIn: 'root'
})
export class WareHouseService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `${environment.apiUrl}/api/Inventory`
  }

  getWareHouseList(requestBody: any): Observable<Response> {
    return this.http.post<Response>(this.url+ "/GetWareHouseResult", requestBody);
  }
 
  getStockPurchaseHistoyResult(requestBody: any): Observable<Response> {
    return this.http.post<Response>(this.url+ "/GetStockPurchaseHistoyResult", requestBody);
  }
 
}