import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {

  public form: UntypedFormGroup;
  public url: any = null;
  selectedfile: any;
  selectedAmountType: any;
  selectedTax: any;
  isVatAmount = true;
  isFullAmount = true;


  constructor(public fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<MakePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data);
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      orderId: new FormControl({ value: this.data?.orderId, disabled: true }),
      netamount: new FormControl({ value: this.data?.netAmount, disabled: true }),
      vatAmount: new FormControl({ value: this.data?.netAmount, disabled: true }),
      nonVatAmount: new FormControl({ value: this.data?.netAmount, disabled: true }),
      amount: [null, Validators.required],
      paymentType: '',
      referenceNumber: '',
      comments: '',
      AmountType: '',
      taxType: ''

    });
  }

  onSubmit() {
    if (this.form.valid) {

    }
  }

  imageUpload(event: any) {
    var file = event.target.files[0];
    this.selectedfile = file;
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.url = event.target.result;
    }
  }

  onTaxTypeChanged(event) {
    if (event.value == 1) {
      this.isVatAmount = true;
    }
    else {
      this.isVatAmount = false;
    }
  }

  onAmountTypeChanged(event) {
    if (event.value == 1) {
      this.isFullAmount = true;
    }
    else {
      this.isFullAmount = false;
    }
  }

}
