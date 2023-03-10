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
@Component({
  selector: "app-order-dialog",
  templateUrl: "./order-dialog.component.html",
  styleUrls: ["./order-dialog.component.scss"],
})
export class OrderDialogComponent implements OnInit {
  private sub: any;
  public orderId: number = 0;
  public errorMessage: string = "";
  public orderDetails: OrderDetails;
  constructor(
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    public snackBar: MatSnackBar,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (this.data.orderDetails) {
        this.orderDetails = this.data.orderDetails;
      }
    });
  }

  public updateCart(updatedQuantity: any, updatedProduct: OrderProduct) {
    updatedQuantity = parseInt(updatedQuantity);
    this.orderDetails.itemTotal = 0;
    if (updatedQuantity >= 0) {
      this.orderDetails.items.forEach((product) => {
        if (product.productId == updatedProduct.productId) {
          product.qty = updatedQuantity;
        }
        this.orderDetails.itemTotal += product.qty * product.salePrice;
      });
    }
  }

  public remove(product) {
    const index: number = this.orderDetails.items.indexOf(product);
    if (index !== -1) {
      this.orderDetails.items.splice(index, 1);
      this.orderDetails.itemTotal -= product.qty * product.salePrice;
    }
  }

  public onSubmit() {
    this.errorMessage = "";
    this.orderService.update(this.orderDetails).subscribe({
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
        this.errorMessage = "Unable to update Order";
      },
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
