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

  url: string;

  constructor(public http: HttpClient) {
    this.url = `${environment.apiUrl}/api/Report`
  }

  // getProductAnalysisReport(requestBody: any): Observable<any> {
  //   return this.http.post<any>(`${this.url}/ProductAnalysisReport`, requestBody);
  // }

  // getRevenueReport(requestBody: any): Observable<any> {
  //   return this.http.post<any>(`${this.url}/RevenueReport`, requestBody);
  // }

  getGraphMetricsReport(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.url}/GetGraphMetricsReport`, requestBody);
  }

  getSaleReport(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.url}/GetSaleReport`, requestBody);
  }

  getMonthlySaleReport(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.url}/GetMonthlySaleReport`, requestBody);
  }

  getRevenueReport(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.url}/GetRevenueReport`, requestBody);
  }

  getProductAnalysisReport(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.url}/GetProductAnalysisReport`, requestBody);
  }

  getWarehouseReport(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.url}/GetWarehouseReport`, requestBody);
  }

  
  
}
