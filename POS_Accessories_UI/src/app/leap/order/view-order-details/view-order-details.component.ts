import { Component, OnInit, Inject } from "@angular/core";
import { UntypedFormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { OrderService } from "src/app/shared/services/order.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Response } from "src/app/shared/models/response";
import { MessageService } from "src/app/shared/services/message.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrderDetails } from "src/app/shared/models/orderDetails";
import { OrderProduct } from "src/app/shared/models/orderProduct";
import { ActionsEnum } from "src/app/shared/enum/actionsEnum";
import { LookupService } from "src/app/shared/services/lookup.service";
import { OrderStatus } from "src/app/shared/models/orderStatus";

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
  action: ActionsEnum = ActionsEnum.Edit;
  ActionsEnum = ActionsEnum;
  orderStatusId  = 0;
  paymentMethodId  = 0;
  shippingId  = 0;
  trackingNumber  = 0;
  orderStatusLookUp: any[];
  orderPaymentLookUp: any[];
  orderDeliveryTypeLookUp: any[];
  

  constructor(
    public dialogRef: MatDialogRef<ViewOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    public snackBar: MatSnackBar,
    private lookupService: LookupService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (this.data) {
        this.orderService.getById(this.data.orderId).subscribe((res) => {
          this.orderDetails = res.data;
          this.deliveryCharges = this.orderDetails.deliveryCharges;
          this.vatPercentage = this.orderDetails.vatPercentage;
          this.discountPercentage = this.orderDetails.discountPercentage;
          this.updateCalculations();
        });
        this.orderId = this.data.orderId;
        this.orderStatusLookUp = this.data.orderStatusLookUp;
        this.orderPaymentLookUp = this.data.orderPaymentLookUp;
        this.orderDeliveryTypeLookUp = this.data.orderDeliveryTypeLookUp;
        this.shippingId = this.data.shippingId;
        this.orderStatusId = this.data.orderStatusId;
        this.paymentMethodId = this.data.paymentMethodId;
      }    
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
    this.grandTotalWithVAT =
      this.netTotal + this.vatAmount + this.deliveryCharges;
    this.grandTotalWithOutVAT = this.netTotal + this.deliveryCharges;
  }

  updateOrderDetails() {
    let body = new OrderStatus();
    body.orderId = this.orderId;
    body.orderStatusId = this.orderStatusId;
    body.paymentMethodId = this.paymentMethodId;
    body.shippingModeId = this.shippingId;
    body.orderId = this.orderId;
    body.orderId = this.orderId;
    this.orderService.updateStatus(body).subscribe({
      next: (res: Response) => {
        if (res.status) {
          this.messageService.showSuccess(res.data);
        } else {
          this.errorMessage = res.data;
        }
      },
      error: (e) => {
        console.log(e);
        this.messageService.showError("Unable to update Order Status");
      },
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
