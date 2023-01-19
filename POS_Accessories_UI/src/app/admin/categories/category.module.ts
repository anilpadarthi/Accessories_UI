import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { CategoryComponent } from './category.component';
import { AddCategoryComponent } from './add-category/add-category.component';

export const routes: Routes = [ 
  { path: '', component: CategoryComponent, pathMatch: 'full' },
  { path: 'add-category', component: AddCategoryComponent },
  { path: 'add-category/:id', component: AddCategoryComponent, data: { breadcrumb: 'Edit Product' } }, 
];

@NgModule({
  declarations: [
    CategoryComponent,
    AddCategoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    SwiperModule,
    InputFileModule
  ]
})
export class CategoryModule { }
