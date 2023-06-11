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

  constructor(public fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<MakePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router) { 
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.form = this.fb.group({
      orderId: new FormControl({ value: this.data?.orderId, disabled: true }),
      netamount: new FormControl({ value: this.data?.netAmount, disabled: true }),
      amount: [null, Validators.required],
      paymentType: '',
      comments: ''
    });
  }

  onSubmit(){
    if (this.form.valid) {

    }
  }

}
