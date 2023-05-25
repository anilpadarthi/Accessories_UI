import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/shared/models/category';
import { Response } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountabilityService {

  baseUrl: string;

  constructor(public httpClient: HttpClient) { 
    this.baseUrl = environment.apiUrl;
  }

  //TODO:Keep the prefix url in environment file.
  //public url = environment.url + 'https://localhost:44352/api/Category';

  getByPaging(requestBody: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/Category/GetByPaging`, requestBody);
  }

  getById(id: number): Observable<Response> {
    return this.httpClient.get<Response>(`${this.baseUrl}/api/Category/${id}`);
  }

  create(category: Category): Observable<Response> {
    return this.httpClient.post<Response>(`${this.baseUrl}/api/Category`, category);
  }

  update(category: Category): Observable<Response> {
    return this.httpClient.put<Response>(`${this.baseUrl}/api/Category`, category);
  }

  updateStatus(category: Category): Observable<Response> {
    return this.httpClient.put<Response>(`${this.baseUrl}/api/Category/UpdateStatus`, category);
  }

  delete(category: Category): Observable<Response> {
    return this.httpClient.put<Response>(`${this.baseUrl}/api/Category/UpdateStatus`, category);
  }
  
}
