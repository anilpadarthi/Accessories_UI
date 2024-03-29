import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/shared/models/category';
import { Response } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url: string;

  public categorySubject = new BehaviorSubject<any>('');    
  public categorySubject$ = this.categorySubject.asObservable();

  constructor(public http: HttpClient) {
    this.url = `${environment.apiUrl}/api/Category`
  }

  getCategoryList(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getAll(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }

  
  getCategory(id: number): Observable<Response> {
    return this.http.get<Response>(this.url + '/' + id);
  }

  addCategory(category: any): Observable<Response> {
    return this.http.post<Response>(this.url, category);
  }

  updateCategory(category: any): Observable<Response> {
    return this.http.put<Response>(this.url, category);
  }

  deleteCategory(category: Category): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus",category);
  }
}
