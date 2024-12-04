import { Component, OnInit, Inject } from "@angular/core";
import { OrderProduct } from "src/app/shared/models/orderProduct";
import { CartService, Data } from "../../shared/services/cart.service";
import { AccountService } from "src/app/shared/services/account.service";
import { ConfigurationService } from "src/app/shared/services/configuration.service";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "src/app/shared/services/order.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  total = [];
  cartItemCount = 0;
  cartItems: any[] = null;
  itemTotal: any = null;
  netTotal: any = null;
  deliveryCharges: any = null;
  vatAmount: any = null;
  discountAmount: any = null;
  discountPercentage: any = null;
  vatPercentage: any = null;
  grandTotalWithVAT: any = null;
  grandTotalWithOutVAT: any = null;

  orderDetails: any = null;

  constructor(
    public cartService: CartService,
    public configurationService: ConfigurationService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const orderId = params["orderId"];
      if (orderId) {
        this.getOrderDetails(orderId);
      }
    });

    this.getDelChargesVat();
    this.cartService.dataSubject$.subscribe((item) => {
      if (item) {
        this.cartItems = item.cartList;
        this.discountPercentage = item.discount;
        this.updateCalculations();
      }
    });
  }

  getOrderDetails(orderId) {
    this.orderService.getById(orderId).subscribe((res) => {
      if (res.data) {
        this.orderDetails = res.data;
        this.cartService.Data.cartList = [];
        if (this.orderDetails?.items) {
          this.cartService.Data.cartList = this.orderDetails?.items;
          this.cartItems = this.orderDetails?.items;
          this.discountPercentage = this.orderDetails?.discountPercentage;
          this.updateCalculations();
        }
      }
    });
  }

  getDelChargesVat() {
    this.configurationService.getActiveConfigurations().subscribe((res) => {
      this.vatPercentage = this.getConfiguration(res.data, 1);
      this.deliveryCharges = this.getConfiguration(res.data, 2);
      this.cartService.Data.vat = this.vatPercentage;
      this.cartService.Data.deliveryCharges = this.deliveryCharges;
      this.updateCalculations();
    });
  }

  public updateCartItem(qty: number, updatedProduct: OrderProduct) {
    if (qty >= 0) {
      this.cartItems.forEach((product) => {
        if (product.productId == updatedProduct.productId) {
          product.qty = qty;
          this.cartService.addToCart(updatedProduct);
        }
      });
    }
    this.updateCalculations();
  }

  public removeCartItem(product) {
    const index: number = this.cartItems.indexOf(product);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.cartService.removeCartItems(this.cartItems);
      this.updateCalculations();
    }
  }

  updateDiscount(discount: any) {
    this.discountPercentage = discount;
    this.updateCalculations();
  }

  updateCalculations() {
    this.itemTotal = 0;
    this.cartItems?.forEach((product) => {
      this.itemTotal += product.qty * product.salePrice;
    });
    this.netTotal = this.itemTotal;
    if (this.discountPercentage > 0) {
      this.cartService.Data.discount = this.discountPercentage;
      this.discountAmount = (this.itemTotal * this.discountPercentage) / 100;
      this.netTotal = this.netTotal - this.discountAmount;
    }
    this.vatAmount = (this.netTotal * this.vatPercentage) / 100;
    this.grandTotalWithVAT =
      this.netTotal + this.vatAmount + this.deliveryCharges;
    this.grandTotalWithOutVAT = this.netTotal + this.deliveryCharges;
    this.cartItemCount = this.cartItems?.length;
  }

  getConfiguration(data: any, configurationType: Number): number {
    let configValue = 0;
    var value = data.filter(
      (a) => a.configurationTypeId == configurationType
    )[0];
    if (value) {
      configValue = value.amount;
    }
    return configValue;
  }
}
