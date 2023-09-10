import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { UserListComponent } from '../user/user-list/user-list.component';
import { CreateUserComponent } from '../user/create-user/create-user.component';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

export const routes: Routes = [ 
  { path: '', component: UserListComponent, pathMatch: 'full' },
  { path: 'create', component: CreateUserComponent },
  { path: 'edit/:id', component: CreateUserComponent, data: { breadcrumb: 'Edit User' } }, 
  { path: 'forgotpassword/:id', component: ForgotPasswordComponent, data: { breadcrumb: 'Forgot Password' } }, 
  { path: 'profile', component: UpdatePasswordComponent, data: { breadcrumb: 'Update Password' } }, 
];

@NgModule({
  declarations: [
    UserListComponent,
    CreateUserComponent,
    ForgotPasswordComponent,
    UpdatePasswordComponent
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
export class UserModule { }
