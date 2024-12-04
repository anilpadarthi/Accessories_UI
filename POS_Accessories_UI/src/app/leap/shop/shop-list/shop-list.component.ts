import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { ShopService } from 'src/app/shared/services/shopservice';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThemePalette } from '@angular/material/core';
import { LookupService } from "src/app/shared/services/lookup.service";


@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})

export class ShopListComponent implements OnInit {

  public settings: Settings;
  searchText!: string | null;
  displayedColumns = ['ID', 'Name', 'PostCode', 'Area', 'Status', 'Actions'];
  tableDataSource: any[] = [];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageIndex = 0;
  totalCount!: number;
  color: ThemePalette = 'primary';
  areaId!: number | null;
  areaList: any[];

  constructor(
    public changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private shopService: ShopService,
    private messageService: MessageService,
    private lookupService: LookupService,
  ) {
    this.settings = this.appSettings.settings;
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
    this.getAreaLookup();
  }

  loadData(): void {
    const request = {
      pageNo: this.pageIndex + 1,
      pageSize: this.pageSize,
      searchText: this.searchText,
      areaId: this.areaId
    };

    this.shopService.getAll(request).subscribe((res) => {
      this.tableDataSource = res.data.results;
      this.totalCount = res.data.totalRecords;
    });
  }

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaList = res.data;
    });
  }

  onAreaChange() {
    this.pageIndex = 0;
    this.loadData();
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadData();
  }

  onReset(): void {
    this.pageIndex = 0;
    this.searchText = null;
    this.loadData();
  }

  updateStatus(element) {
    element.status = !element.status;
  }

  createShop(): void {
    const queryParams = {
    };
    this.router.navigate(["create"], {
      queryParams,
      relativeTo: this.activatedRoute,
    });
  }

  editShop(row: any): void {
    this.router.navigateByUrl(`/shop/edit/${row.shopId}`);
  }

  public remove(category: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm",
        message: "Are you sure you want remove this shop?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(category);
        if (index !== -1) {
          category.status = "D";
          this.shopService.deleteShop(category).subscribe({
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
              this.messageService.showError('Unable to delete shop');
            }
          })
        }
      }
    });
  }
}



