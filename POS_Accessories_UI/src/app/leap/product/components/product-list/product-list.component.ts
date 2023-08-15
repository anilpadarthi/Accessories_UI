import { Component, OnInit, Input } from "@angular/core";
import { Product } from "src/app/shared/models/product";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { AppSettings, Settings } from "src/app/app.settings";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { ProductService } from "../../../../shared/services/product.service";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PaginatorConstants } from "src/app/shared/models/paginator-constants";
import { LookupService } from "src/app/shared/services/lookup.service";
import { MessageService } from "src/app/shared/services/message.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  public page: any;
  public count = 0;
  public settings: Settings;
  searchText!: string | null;
  displayedColumns = ["ID", "Name", "Code", "Status", "Actions"];
  bogusDataSource = new MatTableDataSource<any>();
  pageEvent: PageEvent | undefined;
  tableDataSource: any[] = [];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageIndex = 1;
  totalCount!: number;
  categoryId!: number | null;
  subCategoryId!: number | null;
  categories: any[];
  subCategories: any[];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private productService: ProductService,
    private lookupService: LookupService,
    private messageService: MessageService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getCategoryLookup();
  }

  loadData() {
    const request = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
      searchText: this.searchText,
      categoryId: this.categoryId,
      subCategoryId: this.subCategoryId,
    };

    this.productService.getAll(request).subscribe((res) => {
      this.tableDataSource = res.data.results;
      this.totalCount = res.data.totalRecords;
    });
  }

  getCategoryLookup() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categories = res.data;
      let selectedCategoryId =
        this.activatedRoute.snapshot.queryParamMap.get("categoryId");
      if (selectedCategoryId) {
        this.categoryId = parseInt(selectedCategoryId);
        this.getSubCategoryLookup(this.categoryId);
      } else {
        this.loadData();
      }
    });
  }

  getSubCategoryLookup(categoryId: number) {
    this.lookupService.getSubCategories(categoryId).subscribe((res) => {
      this.subCategories = res.data;
      let selectedSubCategoryId =
        this.activatedRoute.snapshot.queryParamMap.get("subCategoryId");
      if (selectedSubCategoryId) {
        this.subCategoryId = parseInt(selectedSubCategoryId);
        this.loadData();
      }
    });
  }

  onCategoryChange(event: any) {
    this.loadData();
    if (event.value) {
      this.getSubCategoryLookup(event.value);
    } else {
      this.subCategories = [];
    }
  }

  onSubCategoryChange(event: any) {
    this.loadData();
  }

  handlePageEvent(event: PageEvent): void {
    this.pageEvent = event;
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  async onReset(): Promise<void> {
    this.pageIndex = 1;
    this.searchText = null;
    this.categoryId = null;
    this.subCategoryId = null;
    this.subCategories = null;
    await this.loadData();
  }

  public createProduct(): void {
    const queryParams = {
      categoryId: this.categoryId,
      subCategoryId: this.subCategoryId,
    };
    this.router.navigate(["create"], {
      queryParams,
      relativeTo: this.activatedRoute,
    });
  }

  public createBulkProduct(): void {
    const queryParams = {
      categoryId: this.categoryId,
      subCategoryId: this.subCategoryId,
    };
    this.router.navigate(["bulkproduct/create"], {
      queryParams,
      relativeTo: this.activatedRoute,
    });
  }

  public editProduct(row: any): void {
    this.router.navigateByUrl(`/product/edit/${row.productId}`);
  }

  

  

  updateStatus(element) {
    element.status = !element.status;
  }

  public remove(product: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm",
        message: "Are you sure you want remove this product?",
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(product);
        if (index !== -1) {
          product.status = "D";
          this.productService.deleteProduct(product).subscribe({
            next: (res) => {
              if (res.status) {
                this.loadData();
                this.messageService.showSuccess("Deleted successfully.");
              } else {
                this.messageService.showError(res.data);
              }
            },
            error: (e) => {
              console.log(e);
            },
          });
          this.loadData();
        }
      }
    });
  }
}
