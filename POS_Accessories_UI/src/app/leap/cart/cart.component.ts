import { Component, OnInit } from "@angular/core";
import { OrderProduct } from "src/app/shared/models/orderProduct";
import { Product } from "src/app/shared/models/product";
import { Data, CartService } from "../../shared/services/cart.service";
import { ConfigurationService } from "src/app/shared/services/configuration.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  total = [];
  grandTotal = 0;
  grandTotalWithCalculation = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  deliveryCharges = 0;
  vat = 0;
  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.cartService.Data.cartList.forEach((product) => {
      this.total[product.productId] = product.qty * product.salePrice;
      this.grandTotal += product.qty * product.salePrice;
      this.cartItemCount[product.productId] = product.qty;
      this.cartItemCountTotal += product.qty;
    });

    this.deliveryCharges = this.cartService.Data.deliveryCharges;
    this.updateGrandTotal();
  }

  public updateCart(updatedQuantity: any, updatedProduct: OrderProduct) {
    updatedQuantity = parseInt(updatedQuantity);
    if (updatedQuantity) {
      this.total[updatedProduct.productId] =
        updatedQuantity * updatedProduct.salePrice;
      this.cartItemCount[updatedProduct.productId] = updatedQuantity;
      this.grandTotal = 0;
      this.total.forEach((price) => {
        this.grandTotal += price;
      });
      this.cartItemCountTotal = 0;
      this.cartItemCount.forEach((count) => {
        this.cartItemCountTotal += count;
      });

      this.cartService.Data.totalPrice = this.grandTotal;
      this.cartService.Data.totalCartCount = this.cartItemCountTotal;
      this.updateGrandTotal();
      this.cartService.Data.cartList.forEach((product) => {
        this.cartItemCount.forEach((count, index) => {
          if (product.productId == index) {
            product.qty = count;
          }
        });
      });
    }
  }

  public remove(product) {
    const index: number = this.cartService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.cartService.Data.cartList.splice(index, 1);
      this.grandTotal = this.grandTotal - this.total[product.productId];
      this.cartService.Data.totalPrice = this.grandTotal;
      this.total.forEach((val) => {
        if (val == this.total[product.id]) {
          this.total[product.id] = 0;
        }
      });
      this.updateGrandTotal();
      this.cartItemCountTotal =
        this.cartItemCountTotal - this.cartItemCount[product.productId];
      this.cartService.Data.totalCartCount = this.cartItemCountTotal;
      this.cartItemCount.forEach((val) => {
        if (val == this.cartItemCount[product.id]) {
          this.cartItemCount[product.productId] = 0;
        }
      });
      this.cartService.resetProductCartCount(product);
    }
  }

  public updateValue(updatedValue: any, control: string) {
    switch (control) {
      case "discount":
        this.cartService.Data.discount = updatedValue;
        this.updateGrandTotal();
        return;
    }
  }

  updateGrandTotal() {
    this.grandTotalWithCalculation = this.grandTotal;
    if (this.cartService.Data.discount > 0) {
      this.grandTotalWithCalculation -=
        (this.grandTotal * this.cartService.Data.discount) / 100;
    }
    this.vat =
      (this.grandTotalWithCalculation * this.cartService.Data.vat) / 100;
    this.grandTotalWithCalculation += this.vat + this.deliveryCharges;
  }
}
