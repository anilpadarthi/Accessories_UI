import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { NgxPaginationModule } from "ngx-pagination";
import { SwiperModule } from "ngx-swiper-wrapper";
import { InputFileModule } from "ngx-input-file";
import { OrdernListComponent } from "../order/ordern-list/ordern-list.component";
import { OrderDialogComponent } from "../order/order-dialog/order-dialog.component";
import { FormsModule } from "@angular/forms";
import { ViewOrderDetailsComponent } from './view-order-details/view-order-details.component';

export const routes: Routes = [
  { path: "", component: OrdernListComponent, pathMatch: "full" },
];

@NgModule({
  declarations: [OrdernListComponent, OrderDialogComponent, ViewOrderDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    SwiperModule,
    InputFileModule,
    FormsModule,
  ],
})
export class OrderModule {}
