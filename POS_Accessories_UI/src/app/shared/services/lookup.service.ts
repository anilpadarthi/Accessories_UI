import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/shared/models/category';
import { Response } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(public http: HttpClient) { }

  //TODO:Keep the prefix url in environment file.
  public url = environment.url + 'https://localhost:7159/api/Lookup/';

  getCategories(): Observable<any> {
    return this.http.get<any>(this.url + 'Categories');
  }

  getSubCategories(categoryId:number): Observable<any> {
    return this.http.get<any>(this.url +categoryId+'/SubCategories');
  }

  getColours(): Observable<any> {
    return this.http.get<any>(this.url+'Colours');
  }

  getSizes(): Observable<any> {
    return this.http.get<any>(this.url+'Sizes');
  }

  getConfigurationTypes(): Observable<any> {
    return this.http.get<any>(this.url+'ConfigurationTypes');
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.url+'Products');
  }
  getSuppliers(): Observable<any> {
    return this.http.get<any>(this.url+'Suppliers');
  }
}
