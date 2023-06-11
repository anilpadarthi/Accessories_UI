import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/shared/services/report.service'
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import { MatPaginator } from '@angular/material/paginator';
import { ProductAnalysis } from 'src/app/shared/models/product-analysis';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-product-revenue-report',
  templateUrl: './product-revenue-report.component.html',
  styleUrls: ['./product-revenue-report.component.scss']
})

export class ProductRevenueReportComponent implements OnInit, AfterViewInit {

  searchText!: string | null;

  displayedColumns: string[] = ['ID', 'Name', 'Code', 'BuyPrice', 'SalePrice', 'Quantity', 'SaleAmount',
    'PurchaseAmount', 'Profit', 'ProfitPercentage', 'AgentCommission', 'ManagerCommission',
    'OperationalCommission', 'Discount', 'Revenue'];

  data: ProductAnalysis[] = [];
  dataSource = new MatTableDataSource<ProductAnalysis>(this.data);

  fromDate: string | null;
  toDate: string | null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(
    private _reportService: ReportService,
    private excelService: ExcelService,
    private snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {  
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    const request = {
      startDate: this.fromDate,
      endDate: this.toDate,
    };

    this._reportService.getProductAnalysisReport(request).subscribe((res) => {
      this.dataSource = new MatTableDataSource<ProductAnalysis>(res.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  onReset(): void {
    this.loadData();
  }

  onFilter(): void {
    this.loadData();
  }

  //Mat table export 
  // onDownload(): void {
  //   this.exporter.exportTable('xlsx', {
  //     fileName: "Product Analysis Report",
  //     sheet: "Product Analysis Report"
  //   });
  // }

  //Data export from json
  onDownload(){
    if(this.dataSource?.data){
      this.excelService.exportAsExcelFile(this.dataSource?.data, 'Product Analysis Report');  
      this.messageService.showSuccess("Product Analysis Report Downloaded Successfully!");
    } else {
      this.messageService.showError('No Data Available to Export!');
    }
  }

}
