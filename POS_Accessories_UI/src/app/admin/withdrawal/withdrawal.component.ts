import { Component, OnInit } from '@angular/core'; 

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss']
})
export class WithdrawalComponent implements OnInit {
  public withdrawal = [
    { id: 1, invoiceId: '#0045', orderIds: ['#2485', '#4152', '#8574'], storeId: 1, amount: 20, charges: 0, payment: 20, date: new Date(2020,1,15,10,45) },
    { id: 2, invoiceId: '#5288', orderIds: ['#7455'], storeId: 2, amount: 45, charges: 5, payment: 50, date: new Date(2020,3,20,12,15) },
    { id: 3, invoiceId: '#6318', orderIds: ['#6122','#8710'], storeId: 2, amount: 30, charges: 0, payment: 30, date: new Date(2020,4,5,18,25) }
  ];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ];
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
