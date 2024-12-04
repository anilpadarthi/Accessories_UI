import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/shared/services/report.service'
import { LookupService } from "src/app/shared/services/lookup.service";

@Component({
  selector: 'app-monthly-sale-report',
  templateUrl: './monthly-sale-report.component.html',
  styleUrls: ['./monthly-sale-report.component.scss']
})

export class MonthlySaleReportComponent implements OnInit {

  fromDate: string | null;
  toDate: string | null;
  selectedUserId: number | null;
  userList = [];

  displayedColumns = [
    'UserId', 
    'UserName',
    "AC",
    "COD",
    "BT",
    "BONUS",
    "FREE",
    "ReturnOrDamaged",
    "SaleOrReturn"    
  ];

  tableDataSource: any;

  constructor(
    private _reportService: ReportService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    this.lookupService.getAgents().subscribe((res) => {
      this.userList = res.data;
    });
  }

  onSearch(): void {
    this.loadData();
  }

  onDownload(): void {    
    this.loadData();
  }

  onReset(): void {
    this.fromDate = null;
    this.toDate = null;
    this.loadData();
  }

  loadData(): void {
    const request = {
      startDate: this.fromDate,
      endDate: this.toDate,
      filterUserId: this.selectedUserId
    };

    this._reportService.getMonthlySaleReport(request).subscribe((res) => {
      this.tableDataSource = res.data;
    });
  }

}

