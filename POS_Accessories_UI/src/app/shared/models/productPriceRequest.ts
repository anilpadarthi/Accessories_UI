export class ProductPriceList {
    constructor(public salePrice:string,
                public fromQty:string,
                public toQty:string ,
                public productPriceMapId?: number, 
                public productId?:number){ }
  }
  