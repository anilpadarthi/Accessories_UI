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

export const routes: Routes = [ 
  { path: '', component: ProductReportComponent, pathMatch: 'full' },
  { path: 'product-revenue', component: ProductRevenueReportComponent, pathMatch: 'full' },
  { path: 'analysis', component: AnalysisReportComponent, pathMatch: 'full' },
  // { path: 'create', component: AddCouponComponent },
  // { path: 'edit/:id', component: AddCouponComponent, data: { breadcrumb: 'Edit Coupon' } }, 
];

@NgModule({
  declarations: [
    ProductReportComponent,
    AnalysisReportComponent,
    ProductRevenueReportComponent    
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
