import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { filter, map, Subscription } from "rxjs";
import { OrderDetails } from "src/app/shared/models/orderDetails";
import { CartService } from "src/app/shared/services/cart.service";
import { OrderService } from "src/app/shared/services/order.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  stepperOrientation: "horizontal" | "vertical" = "horizontal";
  billingForm: UntypedFormGroup;
  deliveryForm: UntypedFormGroup;
  paymentForm: UntypedFormGroup;
  countries = [];
  months = [];
  years = [];
  deliveryMethods = [];
  grandTotal = 0;
  vat = 0;
  discountAmount = 0;
  watcher: Subscription;
  isOrderPlaced: boolean = false;
  deliveryAddress: string = "Charter House,25 High street,Bourne Mouth,UK";
  public form: UntypedFormGroup;

  constructor(
    public cartService: CartService,
    public fb: UntypedFormBuilder,
    public mediaObserver: MediaObserver,
    public orderService: OrderService
  ) {
    this.watcher = mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        if (change.mqAlias == "xs") {
          this.stepperOrientation = "vertical";
        } else if (change.mqAlias == "sm") {
          this.stepperOrientation = "vertical";
        } else if (change.mqAlias == "md") {
          this.stepperOrientation = "horizontal";
        } else {
          this.stepperOrientation = "horizontal";
        }
      });
  }

  ngOnInit() {
    this.cartService.Data.cartList.forEach((product) => {
      this.grandTotal += product.qty * product.salePrice;
    });
    if (this.cartService.Data.discount > 0) {
      this.discountAmount =
        (this.grandTotal * this.cartService.Data.discount) / 100;
      this.grandTotal -= this.discountAmount;
    }
    this.vat = (this.grandTotal * this.cartService.Data.vat) / 100;
    this.grandTotal += this.vat + this.cartService.Data.deliveryCharges;

    this.form = this.fb.group({
      paymentMode: "",
    });
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  public placeOrder() {
    let order = new OrderDetails();
    order.items = this.cartService.Data.cartList;
    order.itemTotal = this.cartService.Data.totalCartCount;
    order.shippingAddress = this.deliveryAddress;
    order.paymentMethod = this.form.value.paymentMode;
    order.discountPercentage = this.cartService.Data.discount;
    order.deliveryCharges = this.cartService.Data.deliveryCharges;
    order.vatAmount = this.vat;
    order.discountAmount = this.discountAmount;
    order.totalWithVATAmount = this.grandTotal;
    order.totalWithOutVATAmount = this.grandTotal - this.vat;
    //TODO:Remove this hardcoding
    order.orderStatus = "Pending";
    order.shopId = 0;
    order.userId = 0;
    this.orderService.create(order).subscribe((res: any) => {
      if (res.status) {
        this.isOrderPlaced = true;
        this.cartService.Data.cartList.length = 0;
        this.cartService.Data.totalPrice = 0;
        this.cartService.Data.totalCartCount = 0;
        this.cartService.Data.discount = null;
        this.cartService.Data.deliveryCharges = null;
        this.cartService.Data.vat = null;
      }
    });
  }
}
