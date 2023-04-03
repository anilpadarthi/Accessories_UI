import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { AppSettings, Settings } from "src/app/app.settings";
import { Router, ActivatedRoute } from "@angular/router";
import { OrderService } from "src/app/shared/services/order.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PaginatorConstants } from "src/app/shared/models/paginator-constants";
import { MessageService } from "src/app/shared/services/message.service";
import { OrderDialogComponent } from "../order-dialog/order-dialog.component";
import { Product } from "src/app/shared/models/product";
import { ProductService } from "src/app/shared/services/product.service";
import { MatSelect } from "@angular/material/select";
import { ActionsEnum } from "src/app/shared/enum/actionsEnum";

@Component({
  selector: "app-ordern-list",
  templateUrl: "./ordern-list.component.html",
  styleUrls: ["./ordern-list.component.scss"],
})
export class OrdernListComponent implements OnInit {
  public settings: Settings;
  searchText!: string | null;
  displayedColumns = [
    "OrderId",
    "CreatedDate",
    "User",
    "Shop",
    "OrderStatus",
    "PaymenthMethod",
    "Amount",
    "Actions",
  ];
  bogusDataSource = new MatTableDataSource<any>();
  pageEvent: PageEvent | undefined;
  tableDataSource: any[] = [];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageIndex = 1;
  totalCount!: number;
  products: Product[];
  action: ActionsEnum = ActionsEnum.Edit;
  ActionsEnum = ActionsEnum;
  constructor(
    public changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private orderService: OrderService,
    private messageService: MessageService,
    private productService: ProductService
  ) {
    this.settings = this.appSettings.settings;
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
    this.getAllProducts();
  }

  loadData(): void {
    const request = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
      searchText: this.searchText,
    };

    this.orderService.getAll(request).subscribe((res) => {
      this.tableDataSource = res.data.results;
      this.totalCount = res.data.totalRecords;
    });
  }

  public getAllProducts() {
    this.productService.getProductList().subscribe((res) => {
      this.products = res.data;
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

  onReset(): void {
    this.pageIndex = 1;
    this.searchText = null;
    this.loadData();
  }

  edit(orderDetails: any, action: ActionsEnum): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      data: {
        orderId: orderDetails.orderId,
        action: action,
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

  public getOrderById(orderId: any, action: ActionsEnum) {
    this.orderService.getById(orderId).subscribe((res: any) => {
      let orderDetails = res.data;
      if (orderDetails.items.length > 0) {
        orderDetails.items.forEach((element) => {
          let filteredProduct = this.products.find(
            (a) => a.productId == element.productId
          );

          element.productName = filteredProduct.productName;
          element.productCode = filteredProduct.productCode;
        });
      }
      this.edit(orderDetails, action);
    });
  }

  updateStatus(element) {
    element.status = !element.status;
  }

  public remove(category: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm",
        message: "Are you sure you want remove this order?",
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(category);
        if (index !== -1) {
          category.status = "D";
          this.orderService.delete(category).subscribe({
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
              this.messageService.showError("Unable to delete Order");
            },
          });
        }
      }
    });
  }

  actionsResetSelect(select: MatSelect): void {
    select.value = null;
    select.close();
  }
  actionsSelectOpen(select: MatSelect) {
    select.placeholder = "";
  }
  actionsSelectClose(select: MatSelect) {
    select.placeholder = "Select";
  }
}
