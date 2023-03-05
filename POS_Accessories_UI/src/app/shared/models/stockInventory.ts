export class Stock {
  constructor(public stockInventoryId: number, 
              public productId:number,
              public productName:string,
              public qty: number,
              public buyPrice:number,
              public supplierId?: number,
              public invoiceNumber?:string){ }
}
