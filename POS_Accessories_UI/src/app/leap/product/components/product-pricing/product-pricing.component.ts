import { Component, OnInit } from '@angular/core';

const COLUMNS_SCHEMA = [
  {
    key: 'from',
    type: 'number',
    label: 'From',
  },
  {
    key: 'to',
    type: 'number',
    label: 'To',
  },
  {
    key: 'price',
    type: 'number',
    label: 'Price',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

@Component({
  selector: 'app-product-pricing',
  templateUrl: './product-pricing.component.html',
  styleUrls: ['./product-pricing.component.scss']
})
export class ProductPricingComponent implements OnInit {
  newRow = {
    id: Date.now(),
    from: '',
    to: '',
    price: '',
    isEdit: true,
  }
  dataSource = [this.newRow];
  columnsSchema: any = COLUMNS_SCHEMA;
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  constructor() { }

  ngOnInit(): void {
  }

  addRow() {
    let newRow = {
      id: Date.now(),
      from: '',
      to: '',
      price: '',
      isEdit: true,
    }
    this.dataSource = [newRow, ...this.dataSource];
  }

  removeRow(id) {
    this.dataSource = this.dataSource.filter((u) => u.id !== id);
    if(this.dataSource.length == 0){
      this.addRow();
    }
  } 

}

