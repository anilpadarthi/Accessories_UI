import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Category } from "src/app/shared/models/category";
import { Response } from "src/app/shared/models/response";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ConfigurationService {
  url: string;

  constructor(public http: HttpClient) {
    this.url = `${environment.apiUrl}/api/Configuration`;
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + "/GetByPaging", requestBody);
  }

  getById(id: number): Observable<Response> {
    return this.http.get<Response>(this.url + "/" + id);
  }

  getActiveConfigurations(): Observable<Response> {
    return this.http.get<Response>(this.url);
  }

  create(category: any): Observable<Response> {
    return this.http.post<Response>(this.url, category);
  }

  update(category: any): Observable<Response> {
    return this.http.put<Response>(this.url, category);
  }

  updateStatus(category: any): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus", category);
  }

  delete(category: any): Observable<Response> {
    return this.http.put<Response>(this.url + "/UpdateStatus", category);
  }
}
