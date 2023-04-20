import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stock } from 'src/app/shared/models/stockInventory';
import { Response } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockInventoryService {

  constructor(public http: HttpClient) { }

  //TODO:Keep the prefix url in environment file.
  public url = environment.url + 'https://localhost:44352/api/StockInventory';

  getStockList(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getAll(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }

  
  getStock(id: number): Observable<Response> {
    return this.http.get<Response>(this.url + '/' + id);
  }

  addStock(stock: Stock): Observable<Response> {
    return this.http.post<Response>(this.url, stock);
  }

  updateStock(stock: Stock): Observable<Response> {
    return this.http.put<Response>(this.url, stock);
  }

  deleteStock(stock: Stock): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus",stock);
  }
}
