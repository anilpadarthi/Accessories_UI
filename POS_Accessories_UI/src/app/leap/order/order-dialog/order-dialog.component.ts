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
  selector: "app-order-dialog",
  templateUrl: "./order-dialog.component.html",
  styleUrls: ["./order-dialog.component.scss"],
})
export class OrderDialogComponent implements OnInit {
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
  deliveryMethodList: [];
  paymentMethodList: [];
  orderStatusList: [];
  orderStatus: OrderStatus;

  constructor(
    public dialogRef: MatDialogRef<OrderDialogComponent>,
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
      if (this.data.orderId) {
        this.orderService.getById(this.data.orderId).subscribe((res) => {
          this.orderDetails = res.data;
          this.orderStatus = new OrderStatus();
          this.orderStatus.orderId = this.orderDetails.orderId;
          this.deliveryCharges = this.orderDetails.deliveryCharges;
          this.vatPercentage = this.orderDetails.vatPercentage;
          this.discountPercentage = this.orderDetails.discountPercentage;
          this.updateCalculations();
        });
      }
      if (this.data.action) {
        this.action = this.data.action;
      }
      if (this.action == ActionsEnum.View) {
        this.lookupService.getStatusTypes().subscribe((res) => {
          this.orderStatusList = res.data;
        });

        this.lookupService.getOrderDeliveryTypes().subscribe((res) => {
          this.deliveryMethodList = res.data;
        });

        this.lookupService.getOrderPaymentTypes().subscribe((res) => {
          this.paymentMethodList = res.data;
        });
      }
    });
  }

  public updateCartItem(qty: number, updatedProduct: OrderProduct) {
    if (qty >= 0) {
      this.orderDetails.items.forEach((product) => {
        if (product.productId == updatedProduct.productId) {
          product.qty = qty;
        }
      });
    }
    this.updateCalculations();
  }

  public removeCartItem(product) {
    const index: number = this.orderDetails.items.indexOf(product);
    if (index !== -1) {
      this.orderDetails.items.splice(index, 1);
      this.updateCalculations();
    }
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

  public onSubmit() {
    this.errorMessage = "";
    let order = new OrderDetails();
    order.items = this.orderDetails.items;
    order.itemTotal = this.itemTotal;
    order.deliveryCharges = this.deliveryCharges;
    order.vatAmount = this.vatAmount;
    order.vatPercentage = this.vatPercentage;
    order.discountAmount = this.discountAmount;
    order.discountPercentage = this.discountPercentage;
    order.totalWithVATAmount = this.grandTotalWithVAT;
    order.totalWithOutVATAmount = this.grandTotalWithOutVAT;
    order.orderId = this.orderDetails.orderId;
    order.shippingMode = this.orderDetails.shippingMode;
    order.paymentMethod = this.orderDetails.paymentMethod;
    order.orderStatus = this.orderDetails.orderStatus;
    order.trackNumber = this.orderDetails.trackNumber;
    this.orderService.update(order).subscribe({
      next: (res: Response) => {
        if (res.status) {
          this.dialogRef.close();
          this.messageService.showSuccess(res.data);
        } else {
          this.errorMessage = res.data;
        }
      },
      error: (e) => {
        console.log(e);
        this.messageService.showError("Unable to update Order");
      },
    });
  }

  updateOrderDetails() {
    this.orderService.updateStatus(this.orderStatus).subscribe({
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
