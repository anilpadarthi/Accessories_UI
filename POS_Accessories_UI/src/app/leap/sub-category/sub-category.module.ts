import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { SubCategoryComponent } from './components/sub-category/sub-category.component';
import { AddSubCategoryComponent } from './components/add-sub-category/add-sub-category.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [ 
  { path: '', component: SubCategoryComponent, pathMatch: 'full' },
  { path: 'create', component: AddSubCategoryComponent },
  { path: 'edit/:id', component: AddSubCategoryComponent, data: { breadcrumb: 'Edit SubCategory' } }, 
];

@NgModule({
  declarations: [
    SubCategoryComponent,
    AddSubCategoryComponent
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
export class SubCategoryModule { }
