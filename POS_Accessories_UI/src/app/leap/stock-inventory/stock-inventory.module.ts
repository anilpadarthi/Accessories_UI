import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { InputFileModule } from 'ngx-input-file';
import { StockInventoryComponent } from './components/stock-inventory/stock-inventory.component';
import { StockInventoryDialogComponent } from './components/stock-inventory-dialog/stock-inventory-dialog.component';
import { FormsModule } from '@angular/forms';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { SaleHistoryComponent } from './components/sale-history/sale-history.component';


export const routes: Routes = [ 
  { path: '', component: StockInventoryComponent, pathMatch: 'full' }, 
  { path: 'warehouse', component: WarehouseComponent },
  { path: 'salehistory', component: SaleHistoryComponent },
];

@NgModule({
  declarations: [
    StockInventoryComponent,
    StockInventoryDialogComponent,
    WarehouseComponent,
    SaleHistoryComponent
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
export class StockInventoryModule { }
