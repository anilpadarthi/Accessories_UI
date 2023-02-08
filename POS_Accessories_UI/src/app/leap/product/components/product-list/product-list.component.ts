import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service'
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { LookupService } from 'src/app/shared/services/lookup.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public page: any;
  public count = 6;
  public settings: Settings;
  searchText!: string | null;
  displayedColumns = ['Id', 'Name', 'Code', 'Status', 'Actions'];
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

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.getCategoryLookup();
  }

  async loadData(): Promise<void> {
    const request = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
      searchText: this.searchText,
      categoryId: this.categoryId,
      subCategoryId: this.subCategoryId
    };

    this.productService.getAll(request).subscribe((res) => {
      this.tableDataSource = res.data.results;
      this.totalCount = res.data.totalRecords;
    });
  }

  getCategoryLookup() {
    this.lookupService.getCategories().subscribe(res => {
      this.categories = res.data;
    });
  }

  getSubCategoryLookup(categoryId: number) {
    this.lookupService.getSubCategories(categoryId).subscribe(res => {
      this.subCategories = res.data;
    });
  }

  onCategoryChange(event: any) {
    this.loadData();
    if (event.value) {
      this.getSubCategoryLookup(event.value);
    }
    else {
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

  search(): void {
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

  public openProductDialog(data: any): void {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  edit(id: any): void {
    this.router.navigateByUrl(`/product/edit/${id}`);
  }

  updateStatus(element) {
    element.status = !element.status;

  }

  public remove(product: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm",
        message: "Are you sure you want remove this product?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(product);
        if (index !== -1) {
          product.status = "D";
          this.productService.deleteProduct(product).subscribe({
            next: (res) => {
              if (res.status) {
                this.loadData();
                this.messageService.showSuccess("Deleted successfully.");
              }
              else {
                this.messageService.showError(res.data);
              }
            },
            error: (e) => {
              console.log(e);
            }
          })
          this.loadData();
        }
      }
    });
  }
}
