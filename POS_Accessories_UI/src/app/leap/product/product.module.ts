import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { ProductComponent } from './components/product/product.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [ 
  { path: '', component: ProductComponent, pathMatch: 'full' },
  { path: 'create', component: AddProductComponent },
  { path: 'edit/:id', component: AddProductComponent, data: { breadcrumb: 'Edit Product' } }, 
];

@NgModule({
  declarations: [
    ProductComponent,
    AddProductComponent
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
export class ProductModule { }
