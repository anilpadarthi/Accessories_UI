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
import { WarehouseComponent } from 'src/app/leap/stock-inventory/components/warehouse/warehouse.component';
import { PurchaseHistoryComponent } from './stock-inventory/components/purchase-history/purchase-history.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';

const allRoles: any[] = [1, 2, 3, 4, 5, 6];
const adminRoles: any[] = [1, 2]

export const routes = [
  {
    path: '',
    component: LeapComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Categories', roles: adminRoles }
      },
      {
        path: 'sub-category',
        loadChildren: () => import('./sub-category/sub-category.module').then(m => m.SubCategoryModule),
        canActivate: [AuthGuardService],
        data: { roles: adminRoles }
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
        canActivate: [AuthGuardService],
        data: { roles: adminRoles }
      },
      {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule),
        canActivate: [AuthGuardService],
        data: { breadcrumb: 'Supplier', roles: adminRoles }
      },
      {
        path: 'coupon',
        loadChildren: () => import('./coupon/coupon.module').then(m => m.CouponModule),
        canActivate: [AuthGuardService],
        data: { roles: adminRoles }
      },
      {
        path: 'configuration',
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule),
        canActivate: [AuthGuardService],
        data: { roles: adminRoles }
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/report.module').then(m => m.ReportModule)
      },
      {
        path: 'order-list',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
        canActivate: [AuthGuardService],
        data: { roles: allRoles }
      },
      {
        path: 'order-create',
        loadChildren: () => import('./products-view/products-view.module').then(m => m.ProductsViewModule),
        canActivate: [AuthGuardService],
        data: { roles: [1, 2, 3, 4, 5] }
      },
      {
        path: 'accountability',
        loadChildren: () => import('./accountability/accountability.module').then(m => m.AccountabilityModule),
        canActivate: [AuthGuardService],
        data: { roles: [1, 2, 3, 4] }
      },
      {
        path: 'products-view',
        loadChildren: () => import('./products-view/products-view.module').then(m => m.ProductsViewModule)
      },
      {
        path: 'checkout',
        loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
      },
      {
        path: 'stock-inventory',
        loadChildren: () => import('./stock-inventory/stock-inventory.module').then(m => m.StockInventoryModule),
        canActivate: [AuthGuardService],
        data: { roles: adminRoles }
      },
      {
        path: 'warehouse',
        component: WarehouseComponent,
        canActivate: [AuthGuardService],
        data: { roles: adminRoles }
      },
      // { path: 'warehouse', loadChildren: () => import('./stock-inventory/stock-inventory.module').then(m => m.StockInventoryModule) },
      // { path: 'purchaseHistory', component: PurchaseHistoryComponent },
      //{ path: 'purchaseHistory', component: PurchaseHistoryComponent }
    ]
  },
  { path: 'error', component: ErrorComponent }

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
