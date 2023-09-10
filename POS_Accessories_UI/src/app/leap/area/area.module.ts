import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { CreateAreaComponent } from '../area/create-area/create-area.component';
import { ArealistComponent } from '../area/arealist/arealist.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [ 
  { path: '', component: ArealistComponent, pathMatch: 'full' },
  { path: 'create', component: CreateAreaComponent },
  { path: 'edit/:id', component: CreateAreaComponent, data: { breadcrumb: 'Edit Area' } }, 
];

@NgModule({
  declarations: [
    ArealistComponent,
    CreateAreaComponent
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
export class AreaModule { }
