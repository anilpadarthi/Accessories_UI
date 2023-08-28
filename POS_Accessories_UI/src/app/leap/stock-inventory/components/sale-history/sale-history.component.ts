
import { Component, OnInit, Input, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { StockInventoryService } from '../../../../shared/services/stockInventory.service'
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { MessageService } from 'src/app/shared/services/message.service';
import { LookupService } from 'src/app/shared/services/lookup.service';
import { WareHouseService } from 'src/app/shared/services/warehouse.service';
import { WareHouse } from 'src/app/shared/models/warehouse';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";



@Component({
  selector: 'app-sale-history',
  templateUrl: './sale-history.component.html',
  styleUrls: ['./sale-history.component.scss']
})
export class SaleHistoryComponent implements OnInit {
  
  public settings: Settings;
  searchText: string= "";
  id:number=0;
  categoryId:number=0;
  subCategoryId:number=0;
  mode:string;
  loggedInUserId:any;
  displayedColumns = ['productId', 'productName','productCode','supplierId','invoiceNumber','qty','buyPrice','createdDate'];
  bogusDataSource = new MatTableDataSource<any>();
  pageEvent: PageEvent | undefined;
  tableDataSource: any[] = [];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageIndex = 1;
  totalCount!: number;
  warehouse:WareHouse[];
  productId:number=0;
  

  constructor(
    public dialogRef: MatDialogRef<SaleHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private stockInventoryService: StockInventoryService,
    private wareHouseService:WareHouseService,
    private messageService: MessageService,
    private lookupService: LookupService,
  ){
    this.settings = this.appSettings.settings;
  }

  async ngOnInit(): Promise<void> {
    console.log('Vamshi');
    console.log(this.data);
    this.loadData();
  }

  loadData(): void {
    console.log(this.data);
     this.getStockPurchaseHistory(this.data.id);
  }
  handlePageEvent(event: PageEvent): void {
    this.pageEvent = event;
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }
 
  getStockPurchaseHistory(productId:number){
    const request = {
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          id:productId,
          categoryId:this.categoryId,
          subCategoryId:this.subCategoryId,
          searchText: this.searchText,
          mode:this.mode,
          loggedInUserId:this.loggedInUserId
  };
  console.log(request);
  this.wareHouseService.getStockPurchaseHistoyResult(request).subscribe((res) => {
    this.warehouse = res.data;
    this.tableDataSource = res.data.results;
    this.totalCount = res.data.totalRecords;
});
}


// openSaleHistoryDialog(productId: any): void {
//   const dialogRef = this.dialog.open(SaleHistoryComponent, {
//     data: {
//       id: productId
//     },
//     panelClass: ["theme-dialog"],
//     autoFocus: false,
//     direction: this.settings.rtl ? "rtl" : "ltr",
//   });
//   dialogRef.afterClosed().subscribe((dialogResult) => {
//     if (dialogResult) {
//       this.loadData();
//     }
//   });
// }


  updateStatus(element) {
    element.status = !element.status;
  }
  onReset():void{}
  search():void{}
}
function ngOnInit() {
  throw new Error('Function not implemented.');
}
