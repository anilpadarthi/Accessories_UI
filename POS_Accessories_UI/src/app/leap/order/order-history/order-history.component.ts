import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OrderService } from "src/app/shared/services/order.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Response } from "src/app/shared/models/response";
import { MessageService } from "src/app/shared/services/message.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrderDetails } from "src/app/shared/models/orderDetails";
import { OrderProduct } from "src/app/shared/models/orderProduct";
import { MatDialog } from '@angular/material/dialog';
import { AppSettings, Settings } from 'src/app/app.settings';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { WareHouseService } from 'src/app/shared/services/warehouse.service';
import { WareHouse } from 'src/app/shared/models/warehouse';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})

export class OrderHistoryComponent implements OnInit {

  private sub: any;
  public orderId: number = 0;
  displayedColumns = ['orderId', 'status', 'paymentMethod', 'courier', 'trackingNumber', 'comments', 'date', 'by'];
  tableDataSource: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<OrderHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    if (this.data.orderId) {
      await this.orderService.getOrderHistory(this.data.orderId).subscribe((res) => {
        this.tableDataSource = res.data;
      });
    }
  }

}
