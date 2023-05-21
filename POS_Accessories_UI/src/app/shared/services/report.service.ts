import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/shared/models/category';
import { Response } from 'src/app/shared/models/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(public http: HttpClient) { }

  //TODO:Keep the prefix url in environment file.
  public url = environment.url + 'https://localhost:44352/api/Report';

  

  getProductAnalysisReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/ProductAnalysisReport', requestBody);
  }

  getRevenueReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/RevenueReport', requestBody);
  }

  getGraphMetricsReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetGraphMetricsReport', requestBody);
  }

  
  
}
