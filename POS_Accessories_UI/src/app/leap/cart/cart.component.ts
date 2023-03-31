import { Component, OnInit, Inject } from "@angular/core";
import { OrderProduct } from "src/app/shared/models/orderProduct";
import { CartService } from "../../shared/services/cart.service";


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

  constructor(public cartService: CartService) { }

  ngOnInit() {
    this.cartItems = this.cartService.Data.cartList;
    this.vatPercentage = this.cartService.Data.vat;
    this.deliveryCharges = this.cartService.Data.deliveryCharges;
    this.discountPercentage = this.cartService.Data.discount;
    this.updateCalculations();
  }

  public updateCartItem(qty: number, updatedProduct: OrderProduct) {
    if (qty >= 0) {
      this.cartItems.forEach((product) => {
        if (product.productId == updatedProduct.productId) {
          product.qty = qty;
        }
      });
    }
    this.updateCalculations();
  }

  public removeCartItem(product) {
    const index: number = this.cartItems.indexOf(product);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.updateCalculations();
    }
  }

  updateCalculations() {
    this.itemTotal = 0;
    this.cartItems.forEach((product) => {
      this.itemTotal += product.qty * product.salePrice;
    });
    this.netTotal = this.itemTotal;
    if (this.discountPercentage > 0) {
      this.cartService.Data.discount = this.discountPercentage;
      this.discountAmount = (this.itemTotal * this.discountPercentage) / 100;
      this.netTotal = this.netTotal - this.discountAmount;
    }
    this.vatAmount = (this.netTotal * this.vatPercentage) / 100;
    this.grandTotalWithVAT = this.netTotal + this.vatAmount + this.deliveryCharges;
    this.grandTotalWithOutVAT = this.netTotal + this.deliveryCharges;
    this.cartItemCount = this.cartItems.length;
  }
}
