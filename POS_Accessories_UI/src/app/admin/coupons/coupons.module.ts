import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CouponsComponent } from './coupons.component';
import { CouponDialogComponent } from './coupon-dialog/coupon-dialog.component';

export const routes: Routes = [
  { path: '', component: CouponsComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    CouponsComponent,
    CouponDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class CouponsModule { }
