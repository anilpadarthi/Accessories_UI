import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormGroup,
  FormArray,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../shared/services/product.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Response } from "src/app/shared/models/response";
import { MessageService } from "src/app/shared/services/message.service";
import { LookupService } from "src/app/shared/services/lookup.service";
import { ReplaySubject, Subject, takeUntil, Observable, startWith, map } from "rxjs";
import { Lookup } from "src/app/shared/models/lookup";
import { ProductPriceList } from "src/app/shared/models/productPriceRequest";
import { Product } from 'src/app/shared/models/product';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bulk-product',
  templateUrl: './bulk-product.component.html',
  styleUrls: ['./bulk-product.component.scss']
})

export class BulkProductComponent implements OnInit {
  private sub: any;
  public bundleProductId: number = 0;
  public categories: Lookup[];
  public filteredCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSubCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredColours: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSizes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public subCategories: Lookup[];
  public categoryFilterCtrl: FormControl<string> = new FormControl<string>("");
  public subCategoryFilterCtrl: FormControl<string> = new FormControl<string>("");
  public colourFilterCtrl: FormControl<string> = new FormControl<string>("");
  public sizeFilterCtrl: FormControl<string> = new FormControl<string>("");
  protected _onDestroy = new Subject<void>();
  public priceList: ProductPriceList[];
  public products: Array<Product> = [];
  filteredProducts: Observable<Product[]>;
  bulkProductForm: FormGroup;
  productId = new FormControl('');
  public url: any = null;
  selectedfile: any;


  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public snackBar: MatSnackBar,
    private messageService: MessageService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {

    this.bulkProductForm = this.fb.group({
      productId: 0,
      productName: [null, Validators.required],
      productCode: [null, Validators.required],
      salePrice:[null, Validators.required],
      categoryId: [null, Validators.required],
      subCategoryId: [null, Validators.required],
      images: null,
      description: null,
      specification: null,      
      bundleProducts: this.fb.array([this.createChild()], Validators.required)
    });

    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.bundleProductId = parseInt(params["id"]);
        this.getProductById();
      }
    });
    this.getCategories();

    this.categoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter("category");
      });

    this.subCategoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter("subCategory");
      });

    this.getProductList();

  }

  getCategories() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categories = res.data;
      this.filteredCategories.next(this.categories.slice());
      let selectedCategoryId =
        this.activatedRoute.snapshot.queryParamMap.get("categoryId");
      if (selectedCategoryId) {
        this.bulkProductForm.patchValue({ categoryId: parseInt(selectedCategoryId) });
        this.getSubCategories(parseInt(selectedCategoryId));
      }
    });
  }

  getSubCategories(categoryId: number) {
    this.lookupService.getSubCategories(categoryId).subscribe((res) => {
      this.subCategories = res.data;
      this.filteredSubCategories.next(this.subCategories.slice());
      let selectedSubCategoryId =
        this.activatedRoute.snapshot.queryParamMap.get("subCategoryId");
      if (selectedSubCategoryId) {
        this.bulkProductForm.patchValue({
          subCategoryId: parseInt(selectedSubCategoryId),
        });
      }
    });
  }



  public getProductById() {
    this.productService.getProduct(this.bundleProductId).subscribe((res: any) => {
      this.bulkProductForm.patchValue(res.data);
      if(res.data?.productImageMaps){
        this.url = environment.apiUrl + '/' + res.data?.productImageMaps[0].imageName
      }
    });
  }

  public navigateToCateogryList() {
    this.router.navigate(["/product"]);
  }


  public onSubmit() {
    const formData = new FormData();
    formData.append("ImageFile", this.selectedfile);
    this.bulkProductForm.value.priceList = this.priceList;
    if (this.bulkProductForm.valid) {
      if (this.bundleProductId === 0) {
        this.productService.addBulkProduct(this.bulkProductForm.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              if (this.selectedfile) {
                formData.append("ProductId", res.data.productId);
                this.productService.addProductImage(formData).subscribe({
                  next: (res: Response) => {
                    if (!res.status) {
                      this.messageService.showError(res.data);
                    }
                  }
                });
              }

              this.goToProductList();
              this.messageService.showSuccess("Product created successfully");
            } else {
              this.messageService.showError(res.data);
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError("Unable to create Product");
          },
        });
      } else {
        this.productService.updateProduct(this.bulkProductForm.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              if (this.selectedfile) {
                formData.append("ProductId", this.productId.toString());
                this.productService.addProductImage(formData).subscribe({
                  next: (res: Response) => {
                    if (!res.status) {
                      this.messageService.showError(res.data);
                    }
                  }
                });
              }
              this.goToProductList();
              this.messageService.showSuccess("Proudct updated successfully");
            } else {
              this.messageService.showError(res.data);
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError("Unable to update Product");
          },
        });
      }
    }
  }

  public onCategorySelectionChange(event: any) {
    if (event.value) {
      this.getSubCategories(event.value);
    }
  }

  protected filter(control: string) {
    let list: Lookup[];
    let filteredList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    let filterCtrl: FormControl<string>;
    switch (control) {
      case "category":
        list = this.categories;
        filteredList = this.filteredCategories;
        filterCtrl = this.categoryFilterCtrl;
        break;
      case "subCategory":
        list = this.subCategories;
        filteredList = this.filteredSubCategories;
        filterCtrl = this.subCategoryFilterCtrl;
        break;
    }
    if (!list) {
      return;
    }

    let search = filterCtrl.value;
    if (!search) {
      filteredList.next(list.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    filteredList.next(
      list.filter((item) => item.name.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getProductList() {
    this.productService.getProductList().subscribe(res => {
      this.products = res.data;
      this.filteredProducts = this.productId.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    });
  }

  private _filter(value: string): Product[] {
    const filterValue = value.toString().toLowerCase();

    return this.products.filter(option => option.productName.toLowerCase().includes(filterValue));
  }

  createChild(): FormGroup {
    return this.fb.group({
      productId: [null, Validators.required],
      quantity: 0
    })
  }

  get bundleProducts(): FormArray {
    return <FormArray>this.bulkProductForm.get('bundleProducts');
  }

  addChildProduct() {
    this.bundleProducts.push(this.createChild());
  }

  removeChildProduct(index: number) {
    console.log('remove the child - ', index);
    this.bundleProducts.removeAt(index);
  }

  validate(event: any, index: number) {
    const matches: any = this.bundleProducts.value.filter(item => item.productId === event.target.value);
    if (matches.length > 1) {
      this.bundleProducts.controls[index].get('productId').setErrors({ 'duplicate': true });
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

  public goToProductList() {
    this.router.navigate(["/product"]);
  }

}

