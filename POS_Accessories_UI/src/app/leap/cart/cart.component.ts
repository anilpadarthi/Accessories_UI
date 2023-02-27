import { Component, OnInit } from '@angular/core';
import { Data, CartService } from '../../shared/services/cart.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  total = [];
  grandTotal = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  constructor(public cartService:CartService) { }

  ngOnInit() {
    this.cartService.Data.cartList.forEach(product=>{
      // this.total[product.productId] = product.cartCount*product.newPrice;
      // this.grandTotal += product.cartCount*product.newPrice;
      this.cartItemCount[product.productId] = product.cartCount;
      this.cartItemCountTotal += product.cartCount;
    })
  }

  public updateCart(value){
    if(value){
      this.total[value.productId] = value.total;
      this.cartItemCount[value.productId] = value.soldQuantity;
      this.grandTotal = 0;
      this.total.forEach(price=>{
        this.grandTotal += price;
      });
      this.cartItemCountTotal = 0;
      this.cartItemCount.forEach(count=>{
        this.cartItemCountTotal +=count;
      });
     
      this.cartService.Data.totalPrice = this.grandTotal;
      this.cartService.Data.totalCartCount = this.cartItemCountTotal;

      this.cartService.Data.cartList.forEach(product=>{
        this.cartItemCount.forEach((count,index)=>{
          if(product.productId == index){
            product.cartCount = count;
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
      this.total.forEach(val => {
        if(val == this.total[product.id]){
          this.total[product.id] = 0;
        }
      });

      this.cartItemCountTotal = this.cartItemCountTotal - this.cartItemCount[product.productId]; 
      this.cartService.Data.totalCartCount = this.cartItemCountTotal;
      this.cartItemCount.forEach(val=>{
        if(val == this.cartItemCount[product.id]){
          this.cartItemCount[product.productId] = 0;
        }
      });
      this.cartService.resetProductCartCount(product);
    }     
  }

  public clear(){
    this.cartService.Data.cartList.forEach(product=>{
      this.cartService.resetProductCartCount(product);
    });
    this.cartService.Data.cartList.length = 0;
    this.cartService.Data.totalPrice = 0;
    this.cartService.Data.totalCartCount = 0;
  } 

}