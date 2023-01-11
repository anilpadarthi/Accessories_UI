import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FollowersComponent } from './followers.component';

export const routes: Routes = [
  { path: '', component: FollowersComponent, pathMatch: 'full' }
]; 

@NgModule({
  declarations: [
    FollowersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    SharedModule,
    NgxPaginationModule
  ]
})
export class FollowersModule { }
