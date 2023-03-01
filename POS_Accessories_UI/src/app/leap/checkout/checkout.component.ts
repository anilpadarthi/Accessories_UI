import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { filter, map, Subscription } from 'rxjs';
import { CartService } from 'src/app/shared/services/cart.service'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  stepperOrientation: 'horizontal' | 'vertical' = "horizontal";
  billingForm: UntypedFormGroup;
  deliveryForm: UntypedFormGroup;
  paymentForm: UntypedFormGroup;
  countries = [];
  months = [];
  years = [];
  deliveryMethods = [];
  grandTotal = 0;
  watcher: Subscription;
  isOrderPlaced:boolean=false;

  constructor(public cartService:CartService, public formBuilder: UntypedFormBuilder, public mediaObserver: MediaObserver) {
    this.watcher = mediaObserver.asObservable()
    .pipe(filter((changes: MediaChange[]) => changes.length > 0), map((changes: MediaChange[]) => changes[0]))
    .subscribe((change: MediaChange) => {
      if (change.mqAlias == 'xs') {
        this.stepperOrientation = 'vertical';
      }
      else if(change.mqAlias == 'sm'){
        this.stepperOrientation = 'vertical';
      }
      else if(change.mqAlias == 'md'){
        this.stepperOrientation = 'horizontal';
      }
      else{
        this.stepperOrientation = 'horizontal';
      }
    });
  }

  ngOnInit() {    
    this.cartService.Data.cartList.forEach(product=>{
      this.grandTotal += product.cartCount*product.newPrice;
    });
  }

  ngOnDestroy() { 
    this.watcher.unsubscribe();
  } 

  public placeOrder(){  
    this.cartService.Data.cartList.length = 0;    
    this.cartService.Data.totalPrice = 0;
    this.cartService.Data.totalCartCount = 0;
  }
}
