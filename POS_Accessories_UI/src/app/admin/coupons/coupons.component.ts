import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatDialog } from '@angular/material/dialog';
import { coupons } from './coupons';
import { CouponDialogComponent } from './coupon-dialog/coupon-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Category } from 'src/app/app.models';
import { AppSettings, Settings } from 'src/app/app.settings';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  public coupons = [];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ];
  public discountTypes = [
    { id: 1, name: 'Percentage discount' },
    { id: 2, name: 'Fixed Cart Discount' },
    { id: 3, name: 'Fixed Product Discount' }
  ];
  public categories:Category[];
  public page: any;
  public count = 6;
  public settings:Settings;
  constructor(public appService:AppService, public dialog: MatDialog, public appSettings:AppSettings) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.coupons = coupons; 
    this.getCategories();
  }

  public getCategories(){   
    this.appService.getCategories().subscribe(data => {
      this.categories = data; 
      this.categories.shift();
    }); 
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public openCouponDialog(data:any){
    const dialogRef = this.dialog.open(CouponDialogComponent, {
      data: {
        coupon: data,
        stores: this.stores,
        categories: this.categories,
        discountTypes: this.discountTypes
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(coupon => { 
      if(coupon){    
        const index: number = this.coupons.findIndex(x => x.id == coupon.id);
        if(index !== -1){
          this.coupons[index] = coupon;
        } 
        else{ 
          let last_coupon= this.coupons[this.coupons.length - 1]; 
          coupon.id = last_coupon.id + 1;
          this.coupons.push(coupon);  
        }          
      }
    });
  }

  public remove(coupon:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this coupon?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        const index: number = this.coupons.indexOf(coupon);
        if (index !== -1) {
          this.coupons.splice(index, 1);  
        } 
      } 
    }); 
  }

}
