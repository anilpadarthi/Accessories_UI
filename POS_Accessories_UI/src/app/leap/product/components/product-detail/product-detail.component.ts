import { Component, OnInit, Inject } from "@angular/core";
import { FormArray, FormGroup, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../shared/services/product.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Response } from "src/app/shared/models/response";
import { MessageService } from "src/app/shared/services/message.service";
import { LookupService } from "src/app/shared/services/lookup.service";
import { ReplaySubject, Subject, takeUntil } from "rxjs";
import { Lookup } from "src/app/shared/models/lookup";
import { ProductPriceList } from "src/app/shared/models/productPriceRequest";
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})

export class ProductDetailComponent implements OnInit {
  public form: UntypedFormGroup;
  private sub: any;
  public productId = 0;
  public categories: Lookup[];
  public filteredCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSubCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredColours: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSizes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public subCategories: Lookup[];
  public sizes: [];
  public colours: [];
  public categoryFilterCtrl: FormControl<string> = new FormControl<string>("");
  public subCategoryFilterCtrl: FormControl<string> = new FormControl<string>("");
  public colourFilterCtrl: FormControl<string> = new FormControl<string>("");
  public sizeFilterCtrl: FormControl<string> = new FormControl<string>("");
  protected _onDestroy = new Subject<void>();
  public priceList: ProductPriceList[];
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

    this.initializeForm();
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.productId = parseInt(params["id"]);
        this.getProductById();
      }
    });

    this.getCategories();
    this.getColours();
    this.getSizes();

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

    this.colourFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter("colour");
      });

    this.sizeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filter("size");
      });
  }

  initializeForm(): void {
    this.form = this.fb.group({
      productId: 0,
      productName: [null, Validators.required],
      productCode: [null, Validators.required],
      displayOrder: 0,
      imageFile: null,
      isNewArrival: false,
      isBundle: false,
      isOutOfStock: false,
      isVatEnabled: false,
      categoryId: null,
      subCategoryId: null,
      description: null,
      specification: null,
      colourList: [[]],
      sizeList: [[]],
      productPrices: this.fb.array([this.createChild()], Validators.required)
    });
  }

  getCategories() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categories = res.data;
      this.filteredCategories.next(this.categories.slice());
      let selectedCategoryId =
        this.activatedRoute.snapshot.queryParamMap.get("categoryId");
      if (selectedCategoryId) {
        this.form.patchValue({ categoryId: parseInt(selectedCategoryId) });
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
        this.form.patchValue({
          subCategoryId: parseInt(selectedSubCategoryId),
        });
      }
    });
  }

  getColours() {
    this.lookupService.getColours().subscribe((res) => {
      this.colours = res.data;
      this.filteredColours.next(this.colours.slice());
    });
  }

  getSizes() {
    this.lookupService.getSizes().subscribe((res) => {
      this.sizes = res.data;
      this.filteredSizes.next(this.sizes.slice());
    });
  }

  public getProductById() {
    this.productService.getProduct(this.productId).subscribe((res: any) => {
      this.form.patchValue(res.data);
      this.getSubCategories(res.data.categoryId);
      if(res.data?.productImageMaps){
        this.url = environment.apiUrl + '/' + res.data?.productImageMaps[0].imageName
      }
    });
  }

  public goToProductList() {
    this.router.navigate(["/product"]);
  }

  public onSubmit() {
    const formData = new FormData();
    formData.append("ImageFile", this.selectedfile);
    if (this.form.valid) {
      if (this.productId === 0) {
        this.productService.addProduct(this.form.value).subscribe({
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
        this.productService.updateProduct(this.form.value).subscribe({
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
      case "colour":
        list = this.colours;
        filteredList = this.filteredColours;
        filterCtrl = this.colourFilterCtrl;
        break;
      case "size":
        list = this.sizes;
        filteredList = this.filteredSizes;
        filterCtrl = this.sizeFilterCtrl;
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

  imageUpload(event: any) {
    var file = event.target.files[0];
    this.selectedfile = file;
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.url = event.target.result;
    }
  }

  createChild(): FormGroup {
    return this.fb.group({
      productPriceId: [null],
      productId: [null],
      fromQty: [null, Validators.required],
      toQty: [null, Validators.required],
      salePrice: [null, Validators.required]
    })
  }

  get productPrices(): FormArray {
    return <FormArray>this.form.get('productPrices');
  }

  addChildProduct() {
    this.productPrices.push(this.createChild());
  }

  removeChildProduct(index: number) {
    console.log('remove the child - ', index);
    this.productPrices.removeAt(index);
  }

  validate(event: any, index: number) {
    const matches: any = this.productPrices.value.filter(item => item.productPriceId === event.target.value);
    if (matches.length > 1) {
      this.productPrices.controls[index].get('childProductId').setErrors({ 'duplicate': true });
    }
  }

}
