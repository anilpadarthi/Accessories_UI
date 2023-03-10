import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { AddSubCategoryComponent } from "src/app/leap/sub-category/components/add-sub-category/add-sub-category.component";
import { AppSettings, Settings } from "src/app/app.settings";
import { Router, ActivatedRoute } from "@angular/router";
import { SubCategoryService } from "../../../../shared/services/subCategory.service";
import { MatTableDataSource } from "@angular/material/table";
import { PaginatorConstants } from "src/app/shared/models/paginator-constants";
import { PageEvent } from "@angular/material/paginator";
import { LookupService } from "src/app/shared/services/lookup.service";
import { MessageService } from "src/app/shared/services/message.service";

@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.scss"],
})
export class SubCategoryComponent implements OnInit {
  public settings: Settings;
  searchText!: string | null;
  categoryId!: number | null;
  displayedColumns = ["Id", "Name", "Status", "Actions"];
  bogusDataSource = new MatTableDataSource<any>();
  tableDataSource: any[] = [];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageEvent: PageEvent | undefined;
  pageIndex = 1;
  totalCount!: number;
  categories: any[];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private subCategroyService: SubCategoryService,
    private lookupService: LookupService,
    private messageService: MessageService
  ) {
    this.settings = this.appSettings.settings;
  }

  async ngOnInit(): Promise<void> {
    let selectedCategory =
      this.activatedRoute.snapshot.queryParamMap.get("categoryId");
    if (selectedCategory) {
      this.categoryId = parseInt(selectedCategory);
    }
    await this.loadData();
    this.getCategoryLookup();
  }

  getCategoryLookup() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categories = res.data;
    });
  }

  onCategoryChange() {
    this.loadData();
  }

  async loadData(): Promise<void> {
    const request = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
      searchText: this.searchText,
      categoryId: this.categoryId,
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
    this.categoryId = null;
    await this.loadData();
  }

  openSubCategoryDialog(subCategoryId: any): void {
    const dialogRef = this.dialog.open(AddSubCategoryComponent, {
      data: {
        id: subCategoryId,
        categoryId: this.categoryId,
      },
      panelClass: ["theme-dialog"],
      autoFocus: false,
      direction: this.settings.rtl ? "rtl" : "ltr",
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.loadData();
      }
    });
  }

  edit(id: any): void {
    this.router.navigateByUrl(`/sub-category/edit/${id}`);
  }

  updateStatus(element) {
    element.status = !element.status;
  }

  public remove(subCategroy: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm",
        message: "Are you sure you want remove this Sub-Category?",
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(subCategroy);
        if (index !== -1) {
          subCategroy.status = "D";
          this.subCategroyService.deleteSubCategory(subCategroy).subscribe({
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
              this.messageService.showError("Unable to delete Sub-Category");
            },
          });
        }
      }
    });
  }
}
