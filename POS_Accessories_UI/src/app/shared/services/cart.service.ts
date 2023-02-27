import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { environment } from 'src/environments/environment';  

export class Data {
    constructor(public categories: Category[],
                public cartList: Product[],
                public totalPrice: number,
                public totalCartCount: number) { }
}

@Injectable({
    providedIn: 'root'
  })
export class CartService {
    public Data = new Data(
        [], // categories
        [],  // cartList
        null, //totalPrice,
        0 //totalCartCount
    )
    
    public url = environment.url + '/assets/data/'; 

    constructor(public http:HttpClient, public snackBar: MatSnackBar) { }
    
    public addToCart(product:Product){
        let message, status;        
       
        this.Data.totalPrice = null;
        this.Data.totalCartCount = null;

        if(this.Data.cartList.filter(item=>item.productId == product.productId)[0]){ 
            let item = this.Data.cartList.filter(item=>item.productId == product.productId)[0];
            item.cartCount = product.cartCount;  
        }
        else{           
            this.Data.cartList.push(product);
        }        
        this.Data.cartList.forEach(product=>{
            // this.Data.totalPrice = this.Data.totalPrice + (product.cartCount * product.newPrice);
            this.Data.totalCartCount = this.Data.totalCartCount + product.cartCount;
        });

        message = 'The product ' + product.productName + ' has been added to cart.'; 
        status = 'success';          
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }

    public resetProductCartCount(product:Product){
        product.cartCount = 0;
    }
} 