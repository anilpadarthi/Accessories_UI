import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierService } from 'src/app/shared/services/supplier.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})

export class AddSupplierComponent implements OnInit {
  public form: UntypedFormGroup;
  private sub: any;
  public supplierId: number = 0;
  public errorMessage: string = '';

  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private supplierService: SupplierService,
    public snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      supplierId: 0,
      supplierName: [null, Validators.required],
      childProducts: this.fb.array([this.createChild()], Validators.required)
    });

    // this.sub = this.activatedRoute.params.subscribe(params => {
    //   if (this.data.id) {
    //     this.supplierId = parseInt(this.data.id);
    //     this.getSupplierById();
    //   }
    // });
  }

  createChild(): FormGroup {
    return this.fb.group({
      childProductId: [null, Validators.required],
      childProductPrice: [null, Validators.required]
    })
  }

  get childProducts(): FormArray {
    return <FormArray>this.form.get('childProducts');
  }

  addChildProduct() {
    this.childProducts.push(this.createChild());
  }

  removeChildProduct(index: number) {
    console.log('remove the child - ', index);
    this.childProducts.removeAt(index);
  }

  public getSupplierById() {
    this.supplierService.getSupplier(this.supplierId).subscribe((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  public onSubmit() {
    this.errorMessage = '';
    if (this.form.valid) {
      if (this.supplierId === 0) {
        this.supplierService.createSupplier(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              //this.dialogRef.close(this.form.value);
              this.messageService.showSuccess(res.data);
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = 'Unable to create Supplier';
          }
        })
      }
      else {
        this.supplierService.updateSupplier(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.messageService.showSuccess(res.data);
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = 'Unable to update Supplier';
          }
        })
      }
    }
  }

  navigateToSupplier(){
    this.router.navigate(["/supplier"]);
  }


  ngOnDestroy() {
    //this.sub.unsubscribe();
  }


}
