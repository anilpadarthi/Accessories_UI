import { Component, OnInit, Input,ChangeDetectorRef } from '@angular/core';
import { Category } from 'src/app/shared/models/category';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

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

  constructor(public changeDetectorRefs: ChangeDetectorRef,public router: Router, public activatedRoute: ActivatedRoute, public dialog: MatDialog, public appSettings: AppSettings, private categoryService: CategoryService,private messageService: MessageService) {
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

    this.categoryService.getAll(request).subscribe((res) => {
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

  public openCategoryDialog(data: any): void {
    this.router.navigate(['create'], { relativeTo: this.activatedRoute });
  }

  edit(id: any): void {
    this.router.navigateByUrl(`/category/edit/${id}`);
  }

  public remove(category: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this category?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(category);
        if (index !== -1) {
          category.status="D";
          this.categoryService.deleteCategory(category).subscribe({
            next: (res) => {
              if (res.status) {   
                this.loadData();
                this.messageService.showSuccess(res.data); 
              }
              else {
                this.messageService.showError(res.data);
              }
            },
            error: (e) => {
              console.log(e);
              this.messageService.showError('Unable to delete Category');
            }
          })
        }
      }
    });
  }
}
