import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { StockInventoryDialogComponent } from '../stock-inventory-dialog/stock-inventory-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { StockInventoryService } from '../../../../shared/services/stockInventory.service'
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { MessageService } from 'src/app/shared/services/message.service';
import { LookupService } from 'src/app/shared/services/lookup.service';
import { Lookup } from 'src/app/shared/models/lookup';

@Component({
  selector: 'app-stock',
  templateUrl: './stock-inventory.component.html',
  styleUrls: ['./stock-inventory.component.scss']
})
export class StockInventoryComponent implements OnInit {

  public settings: Settings;
  searchText!: string | null;
  displayedColumns = ['Id', 'Product','BuyPrice','Quantity','Status', 'Actions'];
  bogusDataSource = new MatTableDataSource<any>();
  pageEvent: PageEvent | undefined;
  tableDataSource: any[] = [];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageIndex = 1;
  totalCount!: number;
  products:Lookup[];

  constructor(
    public changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private stockInventoryService: StockInventoryService,
    private messageService: MessageService,
    private lookupService: LookupService
  ) {
    this.settings = this.appSettings.settings;
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  loadData(): void {
     this.getProducts();
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

  updateStatus(element) {
    element.status = !element.status;
  }
  
  getProducts(){
    this.lookupService.getProducts().subscribe(res => {
      this.products = res.data;
      const request = {
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        searchText: this.searchText
      };
      this.stockInventoryService.getAll(request).subscribe((res) => {
        res.data.results.forEach(element => {
          element.productName = this.products.find(a => a.id == element.productId).name;
        });
        this.tableDataSource = res.data.results;
        this.totalCount = res.data.totalRecords;
    });
    });
  }

  public openStockDialog(stockInventoryId: any){
    const dialogRef = this.dialog.open(StockInventoryDialogComponent, {
        data: {
          id:stockInventoryId
        },
        panelClass: ['theme-dialog'],
        autoFocus: false,
        direction: (this.settings.rtl) ? 'rtl' : 'ltr'
      });
      dialogRef.afterClosed().subscribe(dialogResult => { 
        if(dialogResult){    
          this.loadData();        
        }
      });
  }

  public remove(stock: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm",
        message: "Are you sure you want remove this stock?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index: number = this.tableDataSource.indexOf(stock);
        if (index !== -1) {
          stock.status = "D";
          this.stockInventoryService.deleteStock(stock).subscribe({
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
              this.messageService.showError('Unable to delete Stock');
            }
          })
        }
      }
    });
  }
}
