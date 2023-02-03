import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { InputFileConfig, InputFileModule } from 'ngx-input-file';
const config: InputFileConfig = {
  fileAccept: '*'
};

import { LeapComponent } from './leap.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { FullScreenComponent } from './components/fullscreen/fullscreen.component'; 
import { MessagesComponent } from './components/messages/messages.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component'; 
import { ErrorComponent } from './error/components/error.component';

export const routes = [ 
  { 
    path: '', 
    component: LeapComponent, children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }, 
      { path: 'category', loadChildren: () => import('./category/category.module').then(m => m.CategoryModule), data: { breadcrumb: 'Categories' } },
      { path: 'product', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
      { path: 'sub-category', loadChildren: () => import('./sub-category/sub-category.module').then(m => m.SubCategoryModule) },
    ]
  },
  { path: 'error', component: ErrorComponent}
];

@NgModule({
  declarations: [
    LeapComponent,
    MenuComponent,
    UserMenuComponent,
    FullScreenComponent,
    MessagesComponent,
    BreadcrumbComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InputFileModule.forRoot(config),
  ]
})
export class LeapModule { }
