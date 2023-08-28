import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Product } from "../../shared/models/product";
import { OrderProduct } from "../models/orderProduct";
import { CartService } from "../services/cart.service";

@Component({
  selector: "app-controls",
  templateUrl: "./controls.component.html",
  styleUrls: ["./controls.component.scss"],
})
export class ControlsComponent implements OnInit {
  @Input() product: OrderProduct;
  @Input() type: string;
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  public count: number = 1;
  public align = "center center";
  constructor(public cartService: CartService, public snackBar: MatSnackBar) {}

  ngOnInit() {
    if (this.product) {
      if (this.product.qty > 0) {
        this.count = this.product.qty;
      }
    }
    this.layoutAlign();
  }

  public layoutAlign() {
    if (this.type == "all") {
      this.align = "space-between center";
    } else if (this.type == "wish") {
      this.align = "start center";
    } else {
      this.align = "center center";
    }
  }

  public addToCart(product: Product) {
    let currentProduct = this.cartService.Data.cartList.filter(
      (item) => item.productId == product.productId
    )[0];
    if (currentProduct) {
      if (currentProduct.qty + this.count <= 10) {
        currentProduct.qty = currentProduct.qty + this.count;
      } else {
        this.snackBar.open(
          "You can not add more items than available. In stock " +
            10 +
            " items and you already added " +
            currentProduct.qty +
            " item to your cart",
          "×",
          { panelClass: "error", verticalPosition: "top", duration: 5000 }
        );
        return false;
      }
    } else {
      currentProduct = new OrderProduct(
        product.productId,
        this.count,
        product.salePrice
      );
      currentProduct.productName = product.productName;
      currentProduct.productCode = product.productCode;
    }
    this.cartService.addToCart(currentProduct);
  }

  public openProductDialog(event) {
    this.onOpenProductDialog.emit(event);
  }

  public changeQuantity(value) {
    this.onQuantityChange.emit(value);
  }
}
