import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { ReportService } from 'src/app/shared/services/report.service'
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorConstants } from 'src/app/shared/models/paginator-constants';
import {MatPaginator} from '@angular/material/paginator';
import { ProductAnalysis } from 'src/app/shared/models/product-analysis';

@Component({
  selector: 'app-analysis-report',
  templateUrl: './analysis-report.component.html',
  styleUrls: ['./analysis-report.component.scss']
})
export class AnalysisReportComponent implements OnInit {

  searchText!: string | null;

  displayedColumns: string[] = ['Name', 'AgentCommission', 'DiscountAmount','ManagerCommission', 
  'OperationalCommission', 'Profit','ProfitPercent','PurchaseAmount','Revenue','SaleAmount'];
  
  data: ProductAnalysis[] = [];
  dataSource = new MatTableDataSource<ProductAnalysis>(this.data);

  fromDate: string | null;
  toDate: string | null;
  revenueModel: any;
  Object = Object;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  
  constructor(
    private _reportService: ReportService
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

    this._reportService.getRevenueReport(request).subscribe((res) => {
      this.revenueModel = res.data?.revenueReportViewModel;
      this.dataSource = new MatTableDataSource<ProductAnalysis>(res.data?.agentAnalysisViewModel);
      this.dataSource.paginator = this.paginator;
    });
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
