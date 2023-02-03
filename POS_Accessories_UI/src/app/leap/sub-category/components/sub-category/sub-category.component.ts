import { Component, OnInit, Input } from '@angular/core';
import { SubCategory } from 'src/app/shared/models/subCategory';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { SubCategoryService } from '../../../../shared/services/subCategory.service'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

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

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public dialog: MatDialog, public appSettings: AppSettings, private subCategroyService: SubCategoryService) {
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

    this.subCategroyService.getAll(request).subscribe((res) => {
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

  public openSubCategoryDialog(data: any): void {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  edit(id: any): void {
    this.router.navigateByUrl(`/sub-categroy/edit/${id}`);
  }

  public remove(subCategroy: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this Sub-Categroy?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(subCategroy);
        if (index !== -1) {
          this.subCategroyService.deleteSubCategory(subCategroy.subCategroyId).subscribe({
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
