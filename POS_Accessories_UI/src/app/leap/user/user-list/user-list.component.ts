import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/userservice';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThemePalette } from '@angular/material/core';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {

  public settings: Settings;
  searchText!: string | null;
  displayedColumns = ['ID', 'Name', 'Email','Password','Role', 'Status', 'Actions'];
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
    private userService: UserService,
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

    this.userService.getAll(request).subscribe((res) => {
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

  createUser(): void {
    const queryParams = {
    };
    this.router.navigate(["create"], {
      queryParams,
      relativeTo: this.activatedRoute,
    });
  }

  editUser(row: any): void {
    this.router.navigateByUrl(`/user/edit/${row.userId}`);
  }

  public remove(user: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm",
        message: "Are you sure you want remove this user?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(user);
        if (index !== -1) {
          user.status = "D";
          this.userService.deleteUser(user).subscribe({
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
              this.messageService.showError('Unable to delete user');
            }
          })
        }
      }
    });
  }
}


