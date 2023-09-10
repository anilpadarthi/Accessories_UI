import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/shared/models/category';
import { Response } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `${environment.apiUrl}/api/Shop`
  }

  getShopList(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getAll(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }

  
  getShop(id: number): Observable<Response> {
    return this.http.get<Response>(this.url + '/' + id);
  }

  createShop(category: Category): Observable<Response> {
    return this.http.post<Response>(this.url, category);
  }

  updateShop(category: Category): Observable<Response> {
    return this.http.put<Response>(this.url, category);
  }

  deleteShop(category: Category): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus",category);
  }
}
