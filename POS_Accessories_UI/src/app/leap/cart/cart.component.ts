import { Component, OnInit, Inject } from "@angular/core";
import { OrderProduct } from "src/app/shared/models/orderProduct";
import { CartService } from "../../shared/services/cart.service";
import jwt_decode from 'jwt-decode';
import { AccountService } from "src/app/shared/services/account.service";
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

  constructor(public cartService: CartService, private accountService: AccountService) { }

  ngOnInit() {
    this.cartService.dataSubject$.subscribe(item => {
      if (item) {
        this.cartItems = item.cartList;
        //this.vatPercentage = item.vat;
        //this.deliveryCharges = item.deliveryCharges;
        this.discountPercentage = item.discount;
        this.updateCalculations();
      }
    })
    this.getDelChargesVat();
  }

  getDelChargesVat(){
    const token: any = this.DecodeToken(this.accountService?.getSession());
    const configList = JSON.parse(token?.configurationList);

    this.deliveryCharges = configList.find(item => item.ConfigurationTypeId === 1)?.Amount;
    this.vatPercentage = configList.find(item => item.ConfigurationTypeId === 2)?.Amount;

    this.getDelChargesVat();
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
    this.grandTotalWithVAT =
      this.netTotal + this.vatAmount + this.deliveryCharges;
    this.grandTotalWithOutVAT = this.netTotal + this.deliveryCharges;
    this.cartItemCount = this.cartItems.length;

  }

  DecodeToken(token: string): string {
    return jwt_decode(token);
  }


}
