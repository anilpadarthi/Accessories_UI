import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ProductService } from "src/app/shared/services/product.service";
import { CategoryService } from "src/app/shared/services/category.service";
import { Category } from "../../../shared/models/category";
import { Product } from "../../../shared/models/product";
import { Settings, AppSettings } from "src/app/app.settings";
import { isPlatformBrowser } from "@angular/common";
import { SubCategory } from "src/app/shared/models/subCategory";
import { SubCategoryService } from "src/app/shared/services/subCategory.service";
import { LookupService } from "src/app/shared/services/lookup.service";
import { ProductDialogComponent } from "./product-dialog/product-dialog.component";
import { PaginatorConstants } from "src/app/shared/models/paginator-constants";
import { parseTemplate } from "@angular/compiler";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-products-view",
  templateUrl: "./products-view.component.html",
  styleUrls: ["./products-view.component.scss"],
})
export class ProductsComponent implements OnInit {
  @ViewChild("sidenav", { static: true }) sidenav: any;
  public sidenavOpen: boolean = true;
  private sub: any;
  public viewType: string = "grid";
  public viewCol: number = 25;
  public count: any;
  public sortings = [
    "Sort by Default",
    "Best match",
    "Lowest first",
    "Highest first",
  ];
  public sort: any;
  public products: Array<Product> = [];
  public categories: Category[] = [];
  public subCategories: SubCategory[] = [];
  public brands = [];
  public priceFrom: number = 750;
  public priceTo: number = 1599;
  public colors = [];
  public sizes = [];
  public page: any;
  public settings: Settings;
  public showExtraFilter: boolean = false;
  pageSize = 20;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageIndex = 1;
  pageEvent: PageEvent | undefined;
  totalCount!: number;
  categoryId: number;
  subCategoryId: number;

  constructor(
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
    public productService: ProductService,
    public categoryService: CategoryService,
    public subCategoryService: SubCategoryService,
    public dialog: MatDialog,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.settings = this.appSettings.settings;
    this.categoryService.categorySubject$.subscribe(item => {
      if(item && item.name){
        this.getProductsOnCategorySubCategory(item.name);
      }
    })
  }

  ngOnInit() {
    this.sort = this.sortings[0];

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    }

    this.getCategories();

    if (this.showExtraFilter) {
      this.getColours();
      this.getSizes();
    }
  }

  public getAllProducts() {
    let request = {
      pageNo: this.pageIndex,
      pageSize: 100000,
      categoryId: this.categoryId,
      subCategoryId: this.subCategoryId,
    };
    this.productService.getAll(request).subscribe((res) => {
      this.products = res.data.results;
      console.log(this.products);
      this.totalCount = res.data.totalRecords;    
    });
  }

  getCategories() {
    this.categoryService.getCategoryList().subscribe((res) => {
      this.categories = res.data;
      this.getAllProducts();
    });
  }

  getProductsOnCategorySubCategory(name){
    if (name) {
      this.categories.forEach((a) => {
        if (a.categoryName.toLowerCase() == name.toLowerCase()) {
          this.categoryId = a.categoryId;
        }
        if (a.subCategories) {
          a.subCategories.forEach((s) => {
            if (
              s.subCategoryName.toLowerCase() ==
              name.toLowerCase()
            ) {
              this.subCategoryId = s.subCategoryId;
            }
          });
        }
      });
      this.getAllProducts();
    }
  }

  getColours() {
    this.lookupService.getColours().subscribe((res) => {
      this.colors = res.data;
    });
  }

  getSizes() {
    this.lookupService.getSizes().subscribe((res) => {
      this.sizes = res.data;
    });
  }

  // public getBrands(){
  //   this.brands = this.appService.getBrands();
  //   this.brands.forEach(brand => { brand.selected = false });
  // }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth < 960
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
    window.innerWidth < 1280 ? (this.viewCol = 33.3) : (this.viewCol = 25);
  }

  public changeCount(count) {
    this.count = count;
    this.getAllProducts();
  }

  public changeSorting(sort) {
    this.sort = sort;
  }

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product) {
    let dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: "product-dialog",
      direction: this.settings.rtl ? "rtl" : "ltr",
    });
    dialogRef.afterClosed().subscribe((product) => {
      if (product) {
        this.router.navigate(["/products", product.id, product.name]);
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageEvent = event;
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getAllProducts();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  public onChangeCategory(event) {
    if (event.target) {
      // this.router.navigateByUrl(
      //   "/products-view", { state: event.target.innerText.toLowerCase(), skipLocationChange: true }
      // );
      let data = {
        name: event.target.innerText.toLowerCase()
      }
      this.categoryService.categorySubject.next(data);
    }
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }
  
}
