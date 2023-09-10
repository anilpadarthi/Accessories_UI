import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { ShopListComponent } from '../shop/shop-list/shop-list.component';
import { CreateShopComponent } from '../shop/create-shop/create-shop.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [ 
  { path: '', component: ShopListComponent, pathMatch: 'full' },
  { path: 'create', component: CreateShopComponent },
  { path: 'edit/:id', component: CreateShopComponent, data: { breadcrumb: 'Edit Shop' } }, 
];

@NgModule({
  declarations: [
    ShopListComponent,
    CreateShopComponent
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
export class ShopModule { }
