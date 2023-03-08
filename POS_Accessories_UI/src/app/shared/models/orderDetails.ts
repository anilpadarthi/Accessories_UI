import { OrderProduct } from "./orderProduct";

export class OrderDetails {
  constructor(
    public orderId?: number,
    public userId?: number,
    public shopId?: number,
    public itemTotal?: number,
    public vatAmount?: number,
    public deliveryCharges?: number,
    public discountAmount?: number,
    public totalWithVATAmount?: number,
    public totalWithOutVATAmount?: number,
    public couponCode?: string,
    public orderStatus?: string,
    public paymentMethod?: string,
    public shippingMode?: string,
    public trackNumber?: string,
    public shippingAddress?: string,
    public vatPercentage?: number,
    public discountPercentage?: number,
    public items?: OrderProduct[]
  ) {}
}
