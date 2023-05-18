import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubCategory } from 'src/app/shared/models/subCategory';
import { Response } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(public http: HttpClient) { }

  //TODO:Keep the prefix url in environment file.
  public url = environment.url + 'http://api.leap-tel.com/api/SubCategory';

  getSubCategoryList(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getAll(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }

  getSubCategory(id: number): Observable<Response> {
    return this.http.get<Response>(this.url + '/' + id);
  }

  addSubCategory(subCategory: SubCategory): Observable<Response> {
    return this.http.post<Response>(this.url, subCategory);
  }

  updateSubCategory(subCategory: SubCategory): Observable<Response> {
    return this.http.put<Response>(this.url, subCategory);
  }

  deleteSubCategory(subCategory: SubCategory): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus", subCategory);
  }
}
