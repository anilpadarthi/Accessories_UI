import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { ReportService } from 'src/app/shared/services/report.service'
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import {MatPaginator} from '@angular/material/paginator';

import { ProductAnalysis } from 'src/app/shared/models/product-analysis';

@Component({
  selector: 'app-product-revenue-report',
  templateUrl: './product-revenue-report.component.html',
  styleUrls: ['./product-revenue-report.component.scss']
})

export class ProductRevenueReportComponent implements OnInit, AfterViewInit  {

  searchText!: string | null;
  displayedColumns = ['ID', 'Name', 'Code', 'BuyPrice','SalePrice','Quantity','SaleAmount','PurchaseAmount','Profit','ProfitPercentage','AgentCommission','ManagerCommission','OperationalCommission','Discount','Revenue'];
  bogusDataSource = new MatTableDataSource<any>();
  data: ProductAnalysis[] = [];
  tableDataSource = new MatTableDataSource<ProductAnalysis>(this.data);
  dataSourceWithPageSize = new MatTableDataSource<ProductAnalysis>(this.data);
  fromDate: string | null;
  toDate: string | null;
  pageSizes = [10, 20, 25];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  
  constructor(
    private _reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const request = {
      startDate: this.fromDate,
      endDate: this.toDate,
    };

    this._reportService.getProductAnalysisReport(request).subscribe((res) => {
      this.tableDataSource = new MatTableDataSource<ProductAnalysis>(res.data);
      //this.tableDataSource = res.data;
    });
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
  }


  onReset(): void {
   this.loadData();
  }

  onFilter(): void {
    this.loadData();
   }

   onDownload(): void {
    this.loadData();
   }

}
