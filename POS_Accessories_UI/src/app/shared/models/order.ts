import { orderDetailsMap } from "./OrderDetailsMap";

export class Category {
  constructor(public orderId: number, 
              public totalAmount:number,
              public paymentMethod:string,
              public orderDetailsMaps?: orderDetailsMap[]){ }
}
