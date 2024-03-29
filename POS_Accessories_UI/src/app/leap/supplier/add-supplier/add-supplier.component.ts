import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { SupplierService } from 'src/app/shared/services/supplier.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';
import { ProductService } from "src/app/shared/services/product.service";
import { Observable, startWith, map } from "rxjs";
import { Product } from 'src/app/shared/models/product';

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
  public products: Array<Product> = [];
  filteredProducts: Observable<Product[]>;
  childProductId = new FormControl('');

  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    private productService: ProductService,
    private supplierService: SupplierService,
    public snackBar: MatSnackBar,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.initializeForm();
    this.getProductList();
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.supplierId = parseInt(params["id"]);
      }
    });
  }

  initializeForm() {
    this.form = this.fb.group({
      supplierId: 0,
      supplierName: [null, Validators.required],
      code: [null, Validators.required],
      supplierProducts: this.fb.array([this.createChild()], Validators.required)
    });
  }

  getProductList() {
    this.productService.getProductList().subscribe(res => {
      this.products = res.data;
      this.filteredProducts = this.childProductId.valueChanges.pipe(
        startWith(''),
        map(value => this.productfilter(value || '')),
      );

      if(this.supplierId){
        this.getSupplierById(); //Edit Mode
      }

    });
  }

  public getSupplierById() {
    this.supplierService.getSupplier(this.supplierId).subscribe((res: any) => {
      this.editSupplier(res.data);
    });
  }

  editSupplier(data){
    this.form.patchValue({
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      code: data.code,
    });
    this.form.setControl('supplierProducts', this.setExistingProducrs(data.supplierProducts))
  }

  setExistingProducrs(supplierProducts): FormArray {
    const formArray = new FormArray([]);
    supplierProducts.forEach(item => {
      formArray.push(this.fb.group({
        supplierProductId: item.supplierProductId,
        productId: item.productId,
        price: item.price
      }));
    });
    return formArray;
  }

  private productfilter(value: string): Product[] {
    const filterValue = value.toString().toLowerCase();
    return this.products.filter(option => option.productName.toLowerCase().includes(filterValue));
  }

  getTitle(productId: number) {
    return this.products?.find(item => item.productId === productId)?.productName;
  }

  createChild(): FormGroup {
    return this.fb.group({
      supplierProductId: [''],
      productId: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  get supplierProducts(): FormArray {
    return <FormArray>this.form.get('supplierProducts');
  }

  addChildProduct() {
    this.supplierProducts.push(this.createChild());
  }

  removeChildProduct(index: number) {
    console.log('remove the child - ', index);
    this.supplierProducts.removeAt(index);
  }  

  public onSubmit() {
    this.errorMessage = '';
    if (this.form.valid) {
      if (this.supplierId === 0) {
        this.supplierService.createSupplier(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.messageService.showSuccess(res.data);
              this.navigateToSupplier();
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
              this.navigateToSupplier();
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

  navigateToSupplier() {
    this.router.navigate(["/supplier"]);
  }


  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  validate(productId: any, index: number) {
    const matches: any = this.supplierProducts.value.filter(item => item.productId === productId);

    setTimeout(() => {
      if (matches.length > 1) {
        this.supplierProducts.controls[index].get('productId')?.setErrors({ 'duplicate': true });
      } else {
        this.supplierProducts.controls[index].get('productId')?.setErrors(null);
      }
      this.supplierProducts.updateValueAndValidity();
    })

  }

}
