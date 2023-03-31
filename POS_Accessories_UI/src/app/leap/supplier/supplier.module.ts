import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { SupplierListComponent } from '../supplier/supplier-list/supplier-list.component';
import { AddSupplierComponent } from '../supplier/add-supplier/add-supplier.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [ 
  { path: '', component: SupplierListComponent, pathMatch: 'full' },
  { path: 'create', component: AddSupplierComponent },
  { path: 'edit/:id', component: AddSupplierComponent, data: { breadcrumb: 'Edit Supplier' } }, 
];

@NgModule({
  declarations: [
    SupplierListComponent,
    AddSupplierComponent
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
export class SupplierModule { }
