import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/shared/models/category';
import { Response } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(public http: HttpClient) { }

  //TODO:Keep the prefix url in environment file.
  public url = environment.url + 'https://localhost:7159/api/Coupon';


  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }

  getById(id: number): Observable<Response> {
    return this.http.get<Response>(this.url + '/' + id);
  }

  create(category: Category): Observable<Response> {
    return this.http.post<Response>(this.url, category);
  }

  update(category: Category): Observable<Response> {
    return this.http.put<Response>(this.url, category);
  }

  updateStatus(category: Category): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus",category);
  }

  delete(category: Category): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus",category);
  }
  
}
