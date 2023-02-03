import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public page: any;
  public count = 6;
  public settings: Settings;
  searchText!: string | null;
  displayedColumns = ['Id', 'Name', 'Actions'];
  bogusDataSource = new MatTableDataSource<any>();
  pageEvent: PageEvent | undefined;
  tableDataSource: any[] = [];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageIndex = 1;
  totalCount!: number;

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public dialog: MatDialog, public appSettings: AppSettings, private productService: ProductService) {
    this.settings = this.appSettings.settings;
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const request = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
      searchText: this.searchText
    };

    this.productService.getAll(request).subscribe((res) => {
      this.tableDataSource = res.data.results;
      this.totalCount = res.data.totalRecords;
    });
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
    await this.loadData();
  }

  public openProductDialog(data: any): void {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  edit(id: any): void {
    this.router.navigateByUrl(`/product/edit/${id}`);
  }

  public remove(product: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this product?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(product);
        if (index !== -1) {
          this.productService.deleteProduct(product.productId).subscribe({
            next: (res) => {
              console.log(res);
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
