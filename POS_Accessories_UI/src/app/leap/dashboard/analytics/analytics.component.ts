import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { analytics } from '../dashboard.data';
import { ReportService } from 'src/app/shared/services/report.service';
import * as moment from 'moment';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit {

  public analytics: any[];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Month & Year';
  public showYAxisLabel = false;
  public yAxisLabel = 'Amount';
  public colorScheme = {
    domain: ['#283593', '#039BE5', '#FF5252']
  };
  public autoScale = true;
  public roundDomains = true;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    //this.analytics = analytics;
    //this.getGraphMetricsReport()
  }

  onSelect(event) {
    console.log(event);
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      //this.analytics = [...analytics];
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

  getGraphMetricsReport() {
    const requestBody = {}
    this.reportService.getGraphMetricsReport(requestBody).subscribe(res => {
      if (res && res.data) {
        this.formatGraphicalData(res.data);
      }
    })
  }

  dateYearSort = (a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    } else {
      return a.month - b.month;
    };
  };

  formatGraphicalData(data) {
    this.analytics = [];
    const sales = { name: 'Sale Amount', series: [] };
    const purchases = { name: 'Purchase Amount', series: [] };

    data.sort(this.dateYearSort);

    data.forEach(element => {

      if (element.saleAmount) {
        let date = `${moment(element.month, 'M').format('MMM')} ${element.year}`;
        let seriesObj = {
          name: date,
          value: element.saleAmount
        }
        sales.series.push(seriesObj);
      }

      if (element.purchaseAmount) {
        let date = `${moment(element.month, 'M').format('MMM')} ${element.year}`;
        let seriesObj = {
          name: date,
          value: element.purchaseAmount
        }
        purchases.series.push(seriesObj);
      }

    });

    this.analytics.push(sales);
    this.analytics.push(purchases);

  }

}