import { ProductPriceList } from "./productPriceRequest";

export class Product {
  constructor(public productId: number, 
              public productName:string,
              public productCode:string,
              public sizeList:number[],
              public colourList:number[],
              public categoryId?:number,
              public subCategoryId?:number,
              public description?:string,
              public specification?:string,
              public isNewArrival?:boolean,
              public isBundle?:boolean,
              public isOutOfStock?:boolean,
              public isVatEnabled?:boolean,
              public status?:string,
              public images?: string,
              public priceList?:ProductPriceList[],
              public cartCount?:number,
              public availibilityCount?:number,
              public newPrice?:number,
              public oldPrice?:number){ }
}
