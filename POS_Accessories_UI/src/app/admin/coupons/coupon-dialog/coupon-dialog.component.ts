import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-coupon-dialog',
  templateUrl: './coupon-dialog.component.html',
  styleUrls: ['./coupon-dialog.component.scss']
})
export class CouponDialogComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public products = []; 
  public form: UntypedFormGroup;
  constructor(public dialogRef: MatDialogRef<CouponDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public fb: UntypedFormBuilder) { }

  ngOnInit(): void { 
    this.form = this.fb.group({
      id: 0, 
      title: ['', Validators.required],
      code: ['', Validators.required],
      desc: null, 
      discountType: null,
      amount: null,
      expiryDate: null,
      allowFreeShipping: false,
      storeId: null,
      showOnStore: false,
      restriction: this.fb.group({ 
        minimumSpend: null,
        maximumSpend: null,
        individualUseOnly: false,
        excludeSaleItems: false,
        products: [[]],
        categories: [[]]
      }),
      limit: this.fb.group({ 
        perCoupon: null,
        perItems: null,
        perUser: null
      }) 
    }); 

    if(this.data.coupon){
      this.form.patchValue(this.data.coupon);
      this.products = this.data.coupon.restriction.products;
    };
  }

  public onSubmit(){
    console.log(this.form.value);
    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  } 

  public addProduct(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value; 
    if ((value || '').trim()) {
      this.products.push( value.trim() );
    } 
    if (input) {
      input.value = '';
    }  
    this.form['controls'].restriction['controls'].products.patchValue(this.products);
  }

  public removeProduct(fruit: any): void {
    const index = this.products.indexOf(fruit); 
    if (index >= 0) {
      this.products.splice(index, 1);
    }
    this.form['controls'].restriction['controls'].products.patchValue(this.products);
  }

}
