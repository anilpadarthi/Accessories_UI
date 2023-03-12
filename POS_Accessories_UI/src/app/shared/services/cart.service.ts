import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Category } from "../models/category";
import { environment } from "src/environments/environment";
import { OrderProduct } from "../models/orderProduct";

export class Data {
  constructor(
    public categories: Category[],
    public cartList: OrderProduct[],
    public totalPrice: number,
    public totalCartCount: number,
    public discount?: number,
    public vat?: number,
    public deliveryCharges?: number
  ) {}
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  public Data = new Data(
    [], // categories
    [], // cartList
    null, //totalPrice,
    0 //totalCartCount
  );

  public url = environment.url + "/assets/data/";

  constructor(public http: HttpClient, public snackBar: MatSnackBar) {}

  public addToCart(product: OrderProduct) {
    let message, status;

    this.Data.totalPrice = null;
    this.Data.totalCartCount = null;

    if (
      this.Data.cartList.filter(
        (item) => item.productId == product.productId
      )[0]
    ) {
      let item = this.Data.cartList.filter(
        (item) => item.productId == product.productId
      )[0];
      item.qty = product.qty;
    } else {
      this.Data.cartList.push(product);
    }
    this.Data.cartList.forEach((product) => {
      this.Data.totalPrice =
        this.Data.totalPrice + product.qty * product.salePrice;
      this.Data.totalCartCount = this.Data.totalCartCount + product.qty;
    });

    message = "The product " + product.productName + " has been added to cart.";
    status = "success";
    this.snackBar.open(message, "×", {
      panelClass: [status],
      verticalPosition: "top",
      duration: 1000,
    });
  }

  public resetProductCartCount(product: OrderProduct) {
    product.qty = 0;
  }
}
