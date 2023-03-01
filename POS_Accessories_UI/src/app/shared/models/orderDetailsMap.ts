export class orderDetailsMap {
  constructor(public orderDetailId: number, 
              public orderId:number,
              public productId: number,
              public qty:number,
              public salePrice:number,
              public productColourId?:number,
              public productSizeId?:number){ }
}
