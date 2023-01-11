import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public orders = [
    { number: '#3258', date: 'March 29, 2018', status: 'Completed', total: '$140.00 for 2 items', invoice: true },
    { number: '#3145', date: 'February 14, 2018', status: 'On hold', total: '$255.99 for 1 item', invoice: false },
    { number: '#2972', date: 'January 7, 2018', status: 'Processing', total: '$255.99 for 1 item', invoice: true },
    { number: '#2971', date: 'January 5, 2018', status: 'Completed', total: '$73.00 for 1 item', invoice: true },
    { number: '#1981', date: 'December 24, 2017', status: 'Pending Payment', total: '$285.00 for 2 items', invoice: false },
    { number: '#1781', date: 'September 3, 2017', status: 'Refunded', total: '$49.00 for 2 items', invoice: false }, 
    { number: '#3981', date: 'December 24, 2017', status: 'Pending Payment', total: '$285.00 for 2 items', invoice: false },
    { number: '#5781', date: 'September 3, 2017', status: 'Refunded', total: '$49.00 for 2 items', invoice: false },
    { number: '#6258', date: 'March 22, 2019', status: 'Completed', total: '$140.00 for 2 items', invoice: true },
    { number: '#7145', date: 'February 14, 2020', status: 'On hold', total: '$255.99 for 1 item', invoice: false },
    { number: '#1972', date: 'January 10, 2018', status: 'Processing', total: '$255.99 for 1 item', invoice: true },
    { number: '#8971', date: 'October 3, 2019', status: 'Completed', total: '$73.00 for 1 item', invoice: true }
  ]
  public page: any;
  public count = 6;
  constructor() { }

  ngOnInit(): void {
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

}
