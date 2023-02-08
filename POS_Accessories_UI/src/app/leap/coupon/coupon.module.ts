import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { CouponListComponent } from '../coupon/coupon-list/coupon-list.component';
import { AddCouponComponent } from '../coupon/add-coupon/add-coupon.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [ 
  { path: '', component: CouponListComponent, pathMatch: 'full' },
  { path: 'create', component: AddCouponComponent },
  { path: 'edit/:id', component: AddCouponComponent, data: { breadcrumb: 'Edit Coupon' } }, 
];

@NgModule({
  declarations: [
    CouponListComponent,
    AddCouponComponent
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
export class CouponModule { }
