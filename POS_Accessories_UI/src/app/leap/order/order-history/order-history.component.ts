import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OrderService } from "src/app/shared/services/order.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})

export class OrderHistoryComponent implements OnInit {

  private sub: any;
  public orderId: number = 0;
  displayedColumns = ['orderId', 'status', 'paymentMethod', 'courier', 'trackingNumber', 'comments', 'date', 'createdBy'];
  tableDataSource: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<OrderHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    dialogRef.disableClose = true;
  }

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
