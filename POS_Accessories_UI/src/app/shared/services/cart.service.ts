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
    public totalCartCount: number
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
      item.quantity = product.quantity;
    } else {
      this.Data.cartList.push(product);
    }
    this.Data.cartList.forEach((product) => {
      this.Data.totalPrice =
        this.Data.totalPrice + product.quantity * product.price;
      this.Data.totalCartCount = this.Data.totalCartCount + product.quantity;
    });

    message = "The product " + product.productName + " has been added to cart.";
    status = "success";
    this.snackBar.open(message, "×", {
      panelClass: [status],
      verticalPosition: "top",
      duration: 3000,
    });
  }

  public resetProductCartCount(product: OrderProduct) {
    product.quantity = 0;
  }
}
