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
import { ViewOrderDetailsComponent } from "../view-order-details/view-order-details.component";
import { Product } from "src/app/shared/models/product";
import { ProductService } from "src/app/shared/services/product.service";
import { MatSelect } from "@angular/material/select";
import { ActionsEnum } from "src/app/shared/enum/actionsEnum";
import { LookupService } from "src/app/shared/services/lookup.service";


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
  action: ActionsEnum = ActionsEnum.Edit;
  ActionsEnum = ActionsEnum;
  orderStatusId!: number | null;
  fromDate: Date | null;
  toDate: Date | null;
  orderStatusLookUp: any[];
  orderPaymentLookUp: any[];
  orderDeliveryTypeLookUp: any[];
  agentLookUp: any[];
  managerLookUp: any[];
  areaLookUp: any[];

  constructor(
    public changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    // public form: UntypedFormGroup,
    // public fb: UntypedFormBuilder,
    private orderService: OrderService,
    private messageService: MessageService,
    private productService: ProductService,
    private lookupService: LookupService,
  ) {
    this.settings = this.appSettings.settings;
  }

  async ngOnInit(): Promise<void> {
    this.loadData();    
    this.loadDropDowns();
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

  loadDropDowns(): void {

    this.lookupService.getOrderStatusTypes().subscribe((res) => {
      this.orderStatusLookUp = res.data;
    });

    this.lookupService.getOrderPaymentTypes().subscribe((res) => {
      this.orderPaymentLookUp = res.data;
    });

    this.lookupService.getOrderDeliveryTypes().subscribe((res) => {
      this.orderDeliveryTypeLookUp = res.data;
    });

    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookUp = res.data;
    });

    this.lookupService.getAgents().subscribe((res) => {
      this.agentLookUp = res.data;
    });

    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookUp = res.data;
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

  editOrder(orderDetails: any): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      data: {
        orderId: orderDetails.orderId,
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

  viewOrder(orderDetails: any): void {
    const dialogRef = this.dialog.open(ViewOrderDetailsComponent, {
      data: {
        orderId: orderDetails.orderId,
        orderStatusLookUp: this.orderStatusLookUp,
        orderPaymentLookUp: this.orderPaymentLookUp,
        orderDeliveryTypeLookUp: this.orderDeliveryTypeLookUp,
        orderStatusId: orderDetails.orderStatusId,
        paymentMethodId: orderDetails.PaymentMethodId,
        shippingId: orderDetails.ShippingModeId,

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
      if (action == ActionsEnum.Edit) {
        this.editOrder(orderDetails);
      }
      else if (action == ActionsEnum.View) {
        this.viewOrder(orderDetails);
      }
    });
  }

  async onAdvancedFilter(): Promise<void> {
  }

  async downloadInvoice(IsVAT: boolean): Promise<void> {

  }

  async InvoiceEmail(IsVAT: boolean): Promise<void> {

  }

  async viewOrderHistory(): Promise<void> {

  }

  async openMakePayment(): Promise<void> {

  }

  async viewAccountTransactions(): Promise<void> {

  }

}
