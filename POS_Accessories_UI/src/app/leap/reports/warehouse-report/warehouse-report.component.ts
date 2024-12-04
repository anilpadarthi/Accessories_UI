import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/shared/services/report.service'
import { LookupService } from "src/app/shared/services/lookup.service";

@Component({
  selector: 'app-warehouse-report',
  templateUrl: './warehouse-report.component.html',
  styleUrls: ['./warehouse-report.component.scss']
})

export class WarehouseReportComponent implements OnInit {

  searchText:any;
  displayedColumns = [
    'ProductId', 
    "ProductName",
    "ProductCode",
    "BuyTotal",
    "SaleTotal"
  ];

  tableDataSource: any;

  constructor(
    private _reportService: ReportService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
   
  }

  onSearch(): void {
    this.loadData();
  }

  onDownload(): void {    
    this.loadData();
  }

  onReset(): void {
    this.loadData();
  }

  loadData(): void {
    const request = {
      searchText: this.searchText
    };

    this._reportService.getWarehouseReport(request).subscribe((res) => {
      this.tableDataSource = res.data;
    });
  }

}

