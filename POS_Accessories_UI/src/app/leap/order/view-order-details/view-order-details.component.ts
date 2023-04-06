import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OrderService } from "src/app/shared/services/order.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Response } from "src/app/shared/models/response";
import { MessageService } from "src/app/shared/services/message.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrderDetails } from "src/app/shared/models/orderDetails";
import { OrderProduct } from "src/app/shared/models/orderProduct";
import { LookupService } from "src/app/shared/services/lookup.service";

@Component({
  selector: 'app-view-order-details',
  templateUrl: './view-order-details.component.html',
  styleUrls: ['./view-order-details.component.scss']
})
export class ViewOrderDetailsComponent implements OnInit {

  private sub: any;
  public orderId: number = 0;
  public errorMessage: string = "";
  orderDetails: any = null;
  itemTotal: any = null;
  netTotal: any = null;
  deliveryCharges: any = null;
  vatAmount: any = null;
  discountAmount: any = null;
  discountPercentage: any = null;
  vatPercentage: any = null;
  grandTotalWithVAT: any = null;
  grandTotalWithOutVAT: any = null;
  statusId!: number | null;
  paymentMethodId!: number | null;
  deliveryMethodId!: number | null;
  trackingNumber!: any | null;
  orderStatusList: any[];
  PaymentList: any[];
  DeliveryTypeList: any[];

  constructor(
    public dialogRef: MatDialogRef<ViewOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    public snackBar: MatSnackBar,
    private messageService: MessageService,
    private lookupService: LookupService,
  ) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (this.data.orderId) {
        this.orderService.getById(this.data.orderId).subscribe((res) => {
          this.orderDetails = res.data;
          this.deliveryCharges = this.orderDetails.deliveryCharges;
          this.vatPercentage = this.orderDetails.vatPercentage;
          this.discountPercentage = this.orderDetails.discountPercentage;
          this.updateCalculations();
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onClear(): void {

  }

  updateOrder(): void {

  }

  getLookupData(): void {

    this.lookupService.getStatusTypes().subscribe((res) => {
      this.orderStatusList = res.data;
    });
    this.lookupService.getOrderPaymentTypes().subscribe((res) => {
      this.PaymentList = res.data;
    });
    this.lookupService.getOrderDeliveryTypes().subscribe((res) => {
      this.DeliveryTypeList = res.data;
    });
  }

  updateCalculations() {
    this.itemTotal = 0;
    this.orderDetails.items.forEach((product) => {
      this.itemTotal += product.qty * product.salePrice;
    });
    this.netTotal = this.itemTotal;
    if (this.discountPercentage > 0) {
      this.discountAmount = (this.itemTotal * this.discountPercentage) / 100;
      this.netTotal = this.netTotal - this.discountAmount;
    }
    this.vatAmount = (this.netTotal * this.vatPercentage) / 100;
    this.grandTotalWithVAT = this.netTotal + this.vatAmount + this.deliveryCharges;
    this.grandTotalWithOutVAT = this.netTotal + this.deliveryCharges;
  }

}

