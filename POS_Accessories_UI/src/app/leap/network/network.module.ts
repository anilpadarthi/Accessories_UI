import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { NetworkListComponent } from '../network/network-list/network-list.component';
import { CreateNetworkComponent } from '../network/create-network/create-network.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [ 
  { path: '', component: NetworkListComponent, pathMatch: 'full' },
  { path: 'create', component: CreateNetworkComponent },
  { path: 'edit/:id', component: CreateNetworkComponent, data: { breadcrumb: 'Edit Network' } }, 
];

@NgModule({
  declarations: [
    NetworkListComponent,
    CreateNetworkComponent
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
export class NetworkModule { }
