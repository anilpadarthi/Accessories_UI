import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data, AppService } from '../../app.service';
import { Product } from '../../shared/models/product';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  @Input() product: Product;
  @Input() type: string;
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
  public count:number = 1;
  public align = 'center center';
  constructor(public cartService:CartService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    if(this.product){
      if(this.product.cartCount > 0){
        this.count = this.product.cartCount;
      }
    }  
    this.layoutAlign(); 
  }

  public layoutAlign(){
    if(this.type == 'all'){
      this.align = 'space-between center';
    }
    else if(this.type == 'wish'){
      this.align = 'start center';
    }
    else{
      this.align = 'center center';
    }
  }

  public increment(count){
    if(this.count < this.product.availibilityCount){
      this.count++;
      let obj = {
        productId: this.product.productId,
        soldQuantity: this.count,
        // total: this.count * this.product.newPrice
      }
      this.changeQuantity(obj);
    }
    else{
      this.snackBar.open('You can not choose more items than available. In stock ' + this.count + ' items.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
    }    
  }

  public decrement(count){
    if(this.count > 1){
      this.count--;
      let obj = {
        productId: this.product.productId,
        soldQuantity: this.count,
        // total: this.count * this.product.newPrice
      }
      this.changeQuantity(obj);
    }
  }

  public addToCart(product:Product){
    debugger;
    // console.log(product)
    let currentProduct = this.cartService.Data.cartList.filter(item=>item.productId == product.productId)[0];
    if(currentProduct){
      if((currentProduct.cartCount + this.count) <= this.product.availibilityCount){
        product.cartCount = currentProduct.cartCount + this.count;
      }
      else{
        this.snackBar.open('You can not add more items than available. In stock ' + this.product.availibilityCount + ' items and you already added ' + currentProduct.cartCount + ' item to your cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        return false;
      }
    }
    else{
      product.cartCount = this.count;
    }
    this.cartService.addToCart(product);
  }

  public openProductDialog(event){
    this.onOpenProductDialog.emit(event);
  }

  public changeQuantity(value){
      this.onQuantityChange.emit(value);
  }

}