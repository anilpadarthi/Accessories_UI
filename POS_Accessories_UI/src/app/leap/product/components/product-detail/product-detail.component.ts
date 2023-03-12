import { Component, OnInit, Inject } from "@angular/core";
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../shared/services/product.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Response } from "src/app/shared/models/response";
import { MessageService } from "src/app/shared/services/message.service";
import { LookupService } from "src/app/shared/services/lookup.service";
import { ReplaySubject, Subject, takeUntil } from "rxjs";
import { Lookup } from "src/app/shared/models/lookup";
import { ProductPriceList } from "src/app/shared/models/productPriceRequest";
@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  public form: UntypedFormGroup;
  private sub: any;
  public productId: number = 0;
  public categories: Lookup[];
  public filteredCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSubCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );
  public filteredColours: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSizes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public subCategories: Lookup[];
  public sizes: [];
  public colours: [];
  public categoryFilterCtrl: FormControl<string> = new FormControl<string>("");
  public subCategoryFilterCtrl: FormControl<string> = new FormControl<string>(
    ""
  );
  public colourFilterCtrl: FormControl<string> = new FormControl<string>("");
  public sizeFilterCtrl: FormControl<string> = new FormControl<string>("");
  protected _onDestroy = new Subject<void>();
  public priceList: ProductPriceList[];
  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public snackBar: MatSnackBar,
    private messageService: MessageService,
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      productId: 0,
      productName: [null, Validators.required],
      productCode: [null, Validators.required],
      images: null,
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
    });

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
    });
  }

  public navigateToCateogryList() {
    this.router.navigate(["/product"]);
  }
  public onSubmit() {
    console.log(this.form.value);
    this.form.value.priceList = this.priceList;
    if (this.form.valid) {
      if (this.productId === 0) {
        this.productService.addProduct(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.navigateToCateogryList();
              this.messageService.showSuccess(res.data);
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
              this.navigateToCateogryList();
              this.messageService.showSuccess(res.message);
            } else {
              this.messageService.showError(res.message);
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
}
