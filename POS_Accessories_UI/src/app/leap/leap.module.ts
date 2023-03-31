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
      { path: 'supplier', loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule), data: { breadcrumb: 'Supplier' } },
      { path: 'category', loadChildren: () => import('./category/category.module').then(m => m.CategoryModule), data: { breadcrumb: 'Categories' } },
      { path: 'product', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
      { path: 'bulkproduct', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
      { path: 'sub-category', loadChildren: () => import('./sub-category/sub-category.module').then(m => m.SubCategoryModule) },
      { path: 'coupon', loadChildren: () => import('./coupon/coupon.module').then(m => m.CouponModule) },
      { path: 'configuration', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule) },
      { path: 'order-list', loadChildren: () => import('./order/order.module').then(m => m.OrderModule) },
      { path: 'accountability', loadChildren: () => import('./accountability/accountability.module').then(m => m.AccountabilityModule) },
      { path: 'products-view', loadChildren: () => import('./products-view/products-view.module').then(m => m.ProductsViewModule) },
      { path: 'order-create', loadChildren: () => import('./products-view/products-view.module').then(m => m.ProductsViewModule) },
      { path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule) },
      { path: 'cart', loadChildren: () => import('./cart/cart.module').then(m => m.CartModule) },
      { path: 'stock-inventory', loadChildren: () => import('./stock-inventory/stock-inventory.module').then(m => m.StockInventoryModule) },
      { path: 'warehouse', loadChildren: () => import('./stock-inventory/stock-inventory.module').then(m => m.StockInventoryModule) },
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
