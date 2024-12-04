import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { AreaService } from 'src/app/shared/services/areaservice';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-arealist',
  templateUrl: './arealist.component.html',
  styleUrls: ['./arealist.component.scss']
})

export class ArealistComponent implements OnInit {

  public settings: Settings;
  searchText!: string | null;
  displayedColumns = ['ID', 'Name', 'Status', 'Actions'];
  tableDataSource: any[] = [];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageIndex = 0;
  totalCount!: number;
  color: ThemePalette = 'primary';

  constructor(
    public changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private areaService: AreaService,
    private messageService: MessageService
  ) {
    this.settings = this.appSettings.settings;
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  loadData(): void {
    const request = {
      pageNo: this.pageIndex + 1,
      pageSize: this.pageSize,
      searchText: this.searchText
    };

    this.areaService.getAll(request).subscribe((res) => {
      this.tableDataSource = res.data.results;
      this.totalCount = res.data.totalRecords;
    });
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

  createArea(): void {
    const queryParams = {
    };
    this.router.navigate(["create"], {
      queryParams,
      relativeTo: this.activatedRoute,
    });
  }

  editArea(row: any): void {
    this.router.navigateByUrl(`/area/edit/${row.areaId}`);
  }

  public remove(area: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm",
        message: "Are you sure you want remove this area?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(area);
        if (index !== -1) {
          area.status = "D";
          this.areaService.deleteArea(area).subscribe({
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
              this.messageService.showError('Unable to delete area');
            }
          })
        }
      }
    });
  }
}

