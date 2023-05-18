import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { FormsModule } from '@angular/forms';
import { ProductImageComponent } from './components/product-image/product-image.component';
import { ProductPricingComponent } from './components/product-pricing/product-pricing.component';
import { BulkProductComponent } from './components/bulk-product/bulk-product.component';

export const routes: Routes = [ 
  { path: '', component: ProductListComponent, pathMatch: 'full' },
  { path: 'create', component: ProductDetailComponent },
  { path: 'edit/:id', component: ProductDetailComponent, data: { breadcrumb: 'Edit Product' } }, 
  { path: 'bulkproduct/create', component: BulkProductComponent, data: { breadcrumb: 'Create Bulk Product' } }, 
  { path: 'bulkproduct/edit/:id', component: BulkProductComponent, data: { breadcrumb: 'Edit Bulk Product' } }, 
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductImageComponent,
    ProductPricingComponent,
    BulkProductComponent
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
