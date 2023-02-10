import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { CategoryComponent } from './components/category/category.component';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [ 
  { path: '', component: CategoryComponent, pathMatch: 'full' }, 
];

@NgModule({
  declarations: [
    CategoryComponent,
    CategoryDialogComponent
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
export class CategoryModule { }
