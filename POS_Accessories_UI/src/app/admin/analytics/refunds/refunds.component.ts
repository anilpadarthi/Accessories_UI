import { Component } from '@angular/core';
import { refunds } from '../analytics.data';

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss']
})
export class RefundsComponent {
  public refunds: any[]; 
  public showLegend = true;
  public gradient = true;
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  }; 
  public showLabels = true;
  public explodeSlices = false;
  public doughnut = false; 

  constructor() { 
    Object.assign(this, {refunds}); 
  }
  
  public onSelect(event) {
    console.log(event);
  }

}
