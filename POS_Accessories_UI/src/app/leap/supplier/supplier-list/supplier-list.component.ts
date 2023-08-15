import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AddSupplierComponent } from 'src/app/leap/supplier/add-supplier/add-supplier.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierService } from 'src/app/shared/services/supplier.service'
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})

export class SupplierListComponent implements OnInit {

  public settings: Settings;
  searchText!: string | null;
  displayedColumns = ['ID', 'Name', 'Code', 'Status', 'Actions'];
  bogusDataSource = new MatTableDataSource<any>();
  pageEvent: PageEvent | undefined;
  tableDataSource: any[] = [];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageIndex = 1;
  totalCount!: number;

  constructor(
    public changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private supplierService: SupplierService,
    private messageService: MessageService
  ) {
    this.settings = this.appSettings.settings;
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  loadData(): void {
    const request = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
      searchText: this.searchText
    };

    this.supplierService.getAll(request).subscribe((res) => {
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

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  onReset(): void {
    this.pageIndex = 1;
    this.searchText = null;
    this.loadData();
  }

  updateStatus(element) {
    element.status = !element.status;
  }

  createSupplier(): void {
    const queryParams = {
    };
    this.router.navigate(["create"], {
      queryParams,
      relativeTo: this.activatedRoute,
    });
  }

  editSupplier(row: any): void {
    this.router.navigateByUrl(`/supplier/edit/${row.supplierId}`);
  }

  public remove(supplier: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm",
        message: "Are you sure you want remove this supplier?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(supplier);
        if (index !== -1) {
          supplier.status = "D";
          this.supplierService.deleteSupplier(supplier).subscribe({
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
              this.messageService.showError('Unable to delete supplier');
            }
          })
        }
      }
    });
  }
}
