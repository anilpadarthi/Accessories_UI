import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StockInventoryService } from '../../../../shared/services/stockInventory.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { map, Observable, startWith } from 'rxjs';
import { LookupService } from "src/app/shared/services/lookup.service";

@Component({
  selector: 'app-stock-inventory-dialog',
  templateUrl: './stock-inventory-dialog.component.html',
  styleUrls: ['./stock-inventory-dialog.component.scss']
})

export class StockInventoryDialogComponent implements OnInit {
  public form: UntypedFormGroup;
  private sub: any;
  public stockInventoryId: number = 0;
  public errorMessage: string = '';
  public products: Array<Product> = [];
  filteredProducts: Observable<Product[]>;
  productId = new FormControl('');
  suppliers: any[];

  constructor(public dialogRef: MatDialogRef<StockInventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public router: Router, public fb: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private stockInventoryService: StockInventoryService, public snackBar: MatSnackBar, private messageService: MessageService, public productService: ProductService,
    private lookupService: LookupService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      'stockInventoryId': 0,
      'productId': this.productId,
      'qty': [null, Validators.required],
      'supplierId': '',
      'buyPrice': [null, Validators.required],
      'invoiceNumber': null,
    });
    this.getSupplierLookup();
    this.getAllProducts();
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toString().toLowerCase();

    return this.products.filter(option => option.productName.toLowerCase().includes(filterValue));
  }

  public getStockById() {
    this.stockInventoryService.getStock(this.stockInventoryId).subscribe((res: any) => {
      this.form.patchValue(res.data);
      this.form.patchValue({ productId: this.products.find(a => a.productId == res.data.productId).productName });
    });
  }

  public getAllProducts() {
    this.productService.getProductList().subscribe(res => {
      this.products = res.data;
      this.filteredProducts = this.productId.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );

      this.sub = this.activatedRoute.params.subscribe(params => {
        if (this.data.id) {
          this.stockInventoryId = parseInt(this.data.id);
          this.getStockById();
        }
      });
    });
  }

  getSupplierLookup() {
    this.lookupService.getSuppliers().subscribe((res) => {
      this.suppliers = res.data;
    });
  }

  public onSubmit() {
    this.form.value.productId = this.products.find(a => a.productName == this.productId.value).productId;
    this.errorMessage = '';
    if (this.form.valid) {
      if (this.stockInventoryId === 0) {
        this.stockInventoryService.addStock(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.dialogRef.close(this.form.value);
              this.messageService.showSuccess(res.data);
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = 'Unable to create Stock';
          }
        })
      }
      else {
        this.stockInventoryService.updateStock(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.dialogRef.close(this.form.value);
              this.messageService.showSuccess(res.data);
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = 'Unable to update Stock';
          }
        })
      }
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
