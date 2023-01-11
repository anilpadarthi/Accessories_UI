import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomersComponent } from './customers.component';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';

export const routes: Routes = [
  { path: '', component: CustomersComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    CustomersComponent,
    CustomerDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class CustomersModule { }
