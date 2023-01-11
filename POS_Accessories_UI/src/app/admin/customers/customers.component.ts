import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service'; 
import { MatDialog } from '@angular/material/dialog';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { customers } from './customers';
import { AppSettings, Settings } from 'src/app/app.settings';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public customers = [];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ]
  public countries = [];
  public page: any;
  public count = 6;
  public settings:Settings;
  constructor(public appService:AppService, public dialog: MatDialog, public appSettings:AppSettings) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.countries = this.appService.getCountries();
    this.customers = customers; 
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public openCustomerDialog(data:any){
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: {
        customer: data,
        stores: this.stores,
        countries: this.countries
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr' 
    });
    dialogRef.afterClosed().subscribe(customer => { 
      if(customer){    
        const index: number = this.customers.findIndex(x => x.id == customer.id);
        if(index !== -1){
          this.customers[index] = customer;
        } 
        else{ 
          let last_customer= this.customers[this.customers.length - 1]; 
          customer.id = last_customer.id + 1;
          this.customers.push(customer);  
        }          
      }
    });
  }

  public remove(customer:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this customer?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        const index: number = this.customers.indexOf(customer);
        if (index !== -1) {
          this.customers.splice(index, 1);  
        } 
      } 
    }); 
  }

}
