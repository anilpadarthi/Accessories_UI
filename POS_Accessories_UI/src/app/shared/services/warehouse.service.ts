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

  constructor(public http: HttpClient) { }

  //TODO:Keep the prefix url in environment file.
  public url = environment.url + 'https://localhost:44352/api/Inventory';

  getWareHouseList(requestBody: any): Observable<Response> {
    return this.http.post<Response>(this.url+ "/GetWareHouseResult", requestBody);
  }
 
  getStockPurchaseHistoyResult(requestBody: any): Observable<Response> {
    return this.http.post<Response>(this.url+ "/GetStockPurchaseHistoyResult", requestBody);
  }
 
}