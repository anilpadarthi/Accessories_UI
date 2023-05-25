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

  baseUrl: string;

  constructor(public httpClient: HttpClient) { 
    this.baseUrl = environment.apiUrl;
  }

  getProductAnalysisReport(requestBody: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/Report/ProductAnalysisReport`, requestBody);
  }

  getRevenueReport(requestBody: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/Report/RevenueReport`, requestBody);
  }

  getGraphMetricsReport(requestBody: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/Report/GetGraphMetricsReport`, requestBody);
  }

  
  
}
