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
import { LookupService } from "src/app/shared/services/lookup.service";
import { AccountService } from "src/app/shared/services/account.service";

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
  itemTotal = 0;
  vat = 0;
  vatPercentage: any;
  discountAmount = 0;
  grandTotal = 0;
  watcher: Subscription;
  isOrderPlaced: boolean = false;
  public form: UntypedFormGroup;
  areaList: any[];
  shopList: any[];
  shopAddress = '';
  shopId = 0;

  constructor(
    public cartService: CartService,
    public fb: UntypedFormBuilder,
    public mediaObserver: MediaObserver,
    public orderService: OrderService,
    private lookupService: LookupService,
    private accountService: AccountService
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
      this.itemTotal += product.qty * product.salePrice;
    });
    if (this.cartService.Data.discount > 0) {
      this.discountAmount =
        (this.itemTotal * this.cartService.Data.discount) / 100;
      this.itemTotal -= this.discountAmount;
    }
    this.vatPercentage = this.cartService.Data.vat;
    this.vat = (this.itemTotal * this.vatPercentage) / 100;
    this.grandTotal = this.itemTotal + this.vat + this.cartService.Data.deliveryCharges;

    this.form = this.fb.group({
      paymentMode: "",
    });
    this.getAreaLookup();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  public placeOrder() {
    let currentUser = this.accountService.getUserInfo();

    let order = new OrderDetails();
    order.items = this.cartService.Data.cartList;
    order.itemTotal = this.grandTotal;
    order.shippingAddress = this.shopAddress;
    order.paymentMethod = this.form.value.paymentMode;
    order.discountPercentage = this.cartService.Data.discount;
    order.deliveryCharges = this.cartService.Data.deliveryCharges;
    order.vatAmount = this.vat;
    order.vatPercentage = this.vatPercentage;
    order.discountAmount = this.discountAmount;
    order.totalWithVATAmount = this.grandTotal;
    order.totalWithOutVATAmount = this.grandTotal - this.vat;

    //TODO:Remove this hardcoding
    order.orderStatus = "Pending";
    order.shopId = this.shopId;
    order.userId = currentUser.userId;
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

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaList = res.data;
    });
  }

  getShopLookup(areaId: number) {
    this.lookupService.getShops(areaId).subscribe((res) => {
      this.shopList = res.data;
    });
  }

  onAreaChange(event: any) {
    if (event.value) {
      this.getShopLookup(event.value);
    } else {
      this.shopList = [];
    }
  }
  onShopChange(event: any) {
    console.log(event);
    this.shopAddress = event.value.address + ',' + event.value.postCode;
    this.shopId = event.value.shopId;
  }
}
