import { Component, Input, OnInit } from '@angular/core';
import { ProductPriceList } from 'src/app/shared/models/productPriceRequest';

const COLUMNS_SCHEMA = [
  {
    key: 'fromQty',
    type: 'number',
    label: 'From',
  },
  {
    key: 'toQty',
    type: 'number',
    label: 'To',
  },
  {
    key: 'salePrice',
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

  priceList:ProductPriceList[]=[];
  newRow = {
    productPriceMapId: Date.now(),
    fromQty: '',
    toQty: '',
    salePrice: '',
    isEdit: true,
  }
  columnsSchema: any = COLUMNS_SCHEMA;
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  constructor() { 
    if(this.priceList.length == 0){
      this.priceList = [this.newRow];
    }
  }

  ngOnInit(): void {
    
  }

  addRow() {
    let newRow = {
      productPriceMapId: Date.now(),
      fromQty: '',
      toQty: '',
      salePrice: '',
      isEdit: true,
    }
    this.priceList = [newRow,...this.priceList];
  }

  removeRow(id) {
    this.priceList = this.priceList.filter((u) => u.productPriceMapId !== id);
    if(this.priceList.length == 0){
      this.addRow();
    }
  } 
}

