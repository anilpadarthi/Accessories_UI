import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { ProductReportComponent } from '../reports/product-report/product-report.component';
import { FormsModule } from '@angular/forms';
import { AnalysisReportComponent } from './analysis-report/analysis-report.component';
import { ProductRevenueReportComponent } from './product-revenue-report/product-revenue-report.component';
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';
import { SaleReportComponent } from './sale-report/sale-report.component';
import { RevenueReportComponent } from './revenue-report/revenue-report.component';
import { MonthlySaleReportComponent } from './monthly-sale-report/monthly-sale-report.component';
import { ProductAnalysisReportComponent } from './product-analysis-report/product-analysis-report.component';
import { WarehouseReportComponent } from './warehouse-report/warehouse-report.component';

export const routes: Routes = [
  { path: '', 
    component: ProductReportComponent, 
    pathMatch: 'full' },
  {
    path: 'product-analysys',
    component: ProductRevenueReportComponent, //Analysis Report
    canActivate: [AuthGuardService],
    data: { roles: [1, 2] },
    pathMatch: 'full'
  },
  {
    path: 'agent-analysis',
    component: AnalysisReportComponent, //Revenue Report
    canActivate: [AuthGuardService],
    data: { roles: [1, 2, 3, 4] },
    pathMatch: 'full',
  },
  { path: 'salereport', component: SaleReportComponent },
  { path: 'revenuereport', component: RevenueReportComponent },
  { path: 'monthlysalereport', component: MonthlySaleReportComponent },
  { path: 'warehousereport', component: WarehouseReportComponent },
  { path: 'productanalysisreport', component: ProductAnalysisReportComponent },
];

@NgModule({
  declarations: [
    ProductReportComponent,
    AnalysisReportComponent,
    ProductRevenueReportComponent,
    SaleReportComponent,
    RevenueReportComponent,
    MonthlySaleReportComponent,
    ProductAnalysisReportComponent,
    WarehouseReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    SwiperModule,
    InputFileModule,
    FormsModule
  ]
})
export class ReportModule { }
